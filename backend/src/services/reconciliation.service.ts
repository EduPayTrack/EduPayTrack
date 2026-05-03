import { parse } from 'csv-parse/sync';

import { PaymentStatus, ReconciliationStatus, VerificationStatus } from '../generated/prisma';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error-handler';
import { createNotification } from './notification.service';
import { recalculateStudentBalance } from '../utils/balance';
import { writeAuditLog } from '../utils/audit-log';

type RawStatementRow = Record<string, string>;

type StatementColumnMapping = {
    reference?: string;
    payerName?: string;
    description?: string;
    amount?: string;
    transactionDate?: string;
};

const DEFAULT_COLUMN_MAPPING: StatementColumnMapping = {
    reference: 'reference',
    payerName: 'name',
    description: 'description',
    amount: 'amount',
    transactionDate: 'date',
};

const HEADER_ALIASES: Record<keyof StatementColumnMapping, string[]> = {
    reference: ['reference', 'referenceno', 'referenceid', 'transactionreference', 'transref', 'receiptnumber'],
    payerName: ['name', 'payername', 'accountname', 'customername', 'sendername'],
    description: ['description', 'narration', 'details', 'transactiondetails'],
    amount: ['amount', 'credit', 'transactionamount', 'paidamount'],
    transactionDate: ['date', 'transactiondate', 'valuedate', 'paymentdate'],
};

const normalizeHeader = (value: string) => value.toLowerCase().replace(/[\s_-]+/g, '');

const normalizeText = (value?: string | null) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const parseAmount = (value?: string) => {
    if (!value) return 0;
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
};

const parseDate = (value?: string) => {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseCsvRows = (buffer: Buffer) =>
    parse(buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
    }) as RawStatementRow[];

const detectColumnMapping = (headers: string[]): StatementColumnMapping => {
    const mapping: StatementColumnMapping = {};
    const normalizedHeaders = headers.map((header) => ({
        original: header,
        normalized: normalizeHeader(header),
    }));

    (Object.keys(HEADER_ALIASES) as Array<keyof StatementColumnMapping>).forEach((field) => {
        const aliasMatch = normalizedHeaders.find((header) => HEADER_ALIASES[field].includes(header.normalized));
        mapping[field] = aliasMatch?.original || DEFAULT_COLUMN_MAPPING[field];
    });

    return mapping;
};

const getMappedValue = (row: RawStatementRow, field: keyof StatementColumnMapping, mapping: StatementColumnMapping) => {
    const mappedHeader = mapping[field];
    if (!mappedHeader) return '';

    const directValue = row[mappedHeader];
    if (typeof directValue === 'string') return directValue.trim();

    const normalizedTarget = normalizeHeader(mappedHeader);
    const fallbackEntry = Object.entries(row).find(([key]) => normalizeHeader(key) === normalizedTarget);
    return typeof fallbackEntry?.[1] === 'string' ? fallbackEntry[1].trim() : '';
};

const normalizeAmount = (value?: number | string | { toString(): string } | null) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return null;
    }

    return parsed.toFixed(2);
};

const buildMatchScore = (
    statement: { amount: number; reference: string; payerName: string; transactionDate: Date | null },
    payment: any
) => {
    let score = 0;
    const reasons: string[] = [];

    const statementReference = normalizeText(statement.reference);
    const paymentReference = normalizeText(payment.externalReference || payment.receiptNumber);
    const statementAmount = normalizeAmount(statement.amount);
    const paymentAmount = normalizeAmount(payment.amount);

    if (statementReference && paymentReference && statementReference === paymentReference) {
        score += 60;
        reasons.push('Exact reference match');
    }

    if (statementAmount && paymentAmount && statementAmount === paymentAmount) {
        score += 40;
        reasons.push('Exact amount match');
    }

    return { score, reasons };
};

const canAutoApproveSuggestion = (suggestion: { score: number; reasons: string[] }) => {
    const reasons = suggestion.reasons || [];
    return (
        suggestion.score >= 100 &&
        reasons.includes('Exact reference match') &&
        reasons.includes('Exact amount match')
    );
};

const computePreviewRows = async (rawRows: RawStatementRow[], mapping: StatementColumnMapping) => {
    const pendingPayments = await prisma.payment.findMany({
        where: {
            status: PaymentStatus.PENDING,
        },
        include: {
            student: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    studentCode: true,
                },
            },
        },
        orderBy: {
            submittedAt: 'desc',
        },
        take: 500,
    });

    const rows = rawRows.slice(0, 100).map((row, index) => {
        const reference = getMappedValue(row, 'reference', mapping);
        const payerName = getMappedValue(row, 'payerName', mapping);
        const description = getMappedValue(row, 'description', mapping);
        const amount = parseAmount(getMappedValue(row, 'amount', mapping));
        const transactionDate = parseDate(getMappedValue(row, 'transactionDate', mapping));
        const statement = { amount, reference, payerName, transactionDate };

        const suggestions = pendingPayments
            .map((payment) => {
                const { score, reasons } = buildMatchScore(statement, payment);
                return {
                    id: payment.id,
                    amount: Number(payment.amount),
                    status: payment.status,
                    reconciliationStatus: payment.reconciliationStatus,
                    reference: payment.externalReference || payment.receiptNumber || 'N/A',
                    student: payment.student,
                    score,
                    reasons,
                    canAutoApprove: canAutoApproveSuggestion({ score, reasons }),
                };
            })
            .filter((candidate) => candidate.score >= 25)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        return {
            rowNumber: index + 1,
            rawData: row,
            reference,
            payerName,
            description,
            amount,
            transactionDate,
            matchState:
                suggestions.length === 0
                    ? 'NO_MATCH'
                    : suggestions[0].score >= 100
                        ? 'STRONG_MATCH'
                        : 'POSSIBLE_MATCH',
            suggestions,
        };
    });

    return rows;
};

const buildImportSummary = (rows: Array<{ amount: number; matchState: string }>) => ({
    totalRows: rows.length,
    strongMatches: rows.filter((row) => row.matchState === 'STRONG_MATCH').length,
    possibleMatches: rows.filter((row) => row.matchState === 'POSSIBLE_MATCH').length,
    noMatches: rows.filter((row) => row.matchState === 'NO_MATCH').length,
    totalAmount: rows.reduce((sum, row) => sum + Number(row.amount || 0), 0),
});

const buildPersistedImportSummary = (rows: Array<{ amount?: unknown; matchState?: string }>) =>
    buildImportSummary(
        rows.map((row) => ({
            amount: Number(row.amount || 0),
            matchState: row.matchState || 'NO_MATCH',
        }))
    );

const serializeImport = (statementImport: any) => {
    const rows = (statementImport.rows || []).map((row: any) => ({
        id: row.id,
        rowNumber: row.rowNumber,
        reference: row.reference,
        payerName: row.payerName,
        description: row.description,
        amount: Number(row.amount || 0),
        transactionDate: row.transactionDate,
        matchState: row.matchState,
        suggestions: row.suggestions,
        resolvedPaymentId: row.resolvedPaymentId,
        autoApprovedPaymentId: row.autoApprovedPaymentId,
        raw: row.rawData,
    }));
    const summary = buildPersistedImportSummary(rows);

    return {
        id: statementImport.id,
        fileName: statementImport.fileName,
        uploadedAt: statementImport.uploadedAt,
        totalRows: summary.totalRows,
        totalAmount: Number(summary.totalAmount || 0),
        summary,
        columnMapping: statementImport.columnMapping,
        headers: statementImport.headers || [],
        rows,
    };
};

export const createStatementImport = async (userId: string, file?: Express.Multer.File) => {
    if (!file?.buffer) {
        throw new AppError('Statement file is required', 400);
    }

    const rawRows = parseCsvRows(file.buffer);
    if (rawRows.length === 0) {
        throw new AppError('The statement file did not contain any transaction rows', 400);
    }

    const headers = Object.keys(rawRows[0] || {});
    const mapping = detectColumnMapping(headers);
    const previewRows = await computePreviewRows(rawRows, mapping);
    const summary = buildImportSummary(previewRows);

    const statementImport = await prisma.statementImport.create({
        data: {
            fileName: file.originalname,
            uploadedBy: userId,
            totalRows: summary.totalRows,
            totalAmount: summary.totalAmount,
            summary,
            columnMapping: mapping,
            headers,
            rows: {
                create: previewRows.map((row) => ({
                    rowNumber: row.rowNumber,
                    rawData: row.rawData,
                    reference: row.reference,
                    payerName: row.payerName,
                    description: row.description,
                    amount: row.amount,
                    transactionDate: row.transactionDate,
                    matchState: row.matchState,
                    suggestions: row.suggestions,
                })),
            },
        },
        include: {
            rows: {
                orderBy: { rowNumber: 'asc' },
            },
        },
    });

    return serializeImport(statementImport);
};

export const listStatementImports = async () => {
    const imports = await prisma.statementImport.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    rows: true,
                },
            },
            rows: {
                select: {
                    amount: true,
                    matchState: true,
                },
            },
        },
        orderBy: {
            uploadedAt: 'desc',
        },
        take: 10,
    });

    return imports.map((statementImport) => ({
        summary: buildPersistedImportSummary(statementImport.rows || []),
        id: statementImport.id,
        fileName: statementImport.fileName,
        uploadedAt: statementImport.uploadedAt,
        totalRows: statementImport.totalRows,
        totalAmount: Number(buildPersistedImportSummary(statementImport.rows || []).totalAmount || 0),
        rowCount: statementImport._count.rows,
        uploadedBy: statementImport.user,
    }));
};

export const getStatementImportById = async (importId: string) => {
    const statementImport = await prisma.statementImport.findUnique({
        where: { id: importId },
        include: {
            rows: {
                orderBy: { rowNumber: 'asc' },
            },
        },
    });

    if (!statementImport) {
        throw new AppError('Statement import not found', 404);
    }

    return serializeImport(statementImport);
};

export const updateStatementImportMapping = async (importId: string, mapping: StatementColumnMapping) => {
    const statementImport = await prisma.statementImport.findUnique({
        where: { id: importId },
        include: {
            rows: {
                orderBy: { rowNumber: 'asc' },
            },
        },
    });

    if (!statementImport) {
        throw new AppError('Statement import not found', 404);
    }

    const rawRows = statementImport.rows.map((row) => row.rawData as RawStatementRow);
    const previewRows = await computePreviewRows(rawRows, mapping);
    const summary = buildImportSummary(previewRows);

    const updated = await prisma.$transaction(async (tx) => {
        await tx.statementImport.update({
            where: { id: importId },
            data: {
                totalRows: summary.totalRows,
                totalAmount: summary.totalAmount,
                summary,
                columnMapping: mapping,
            },
        });

        for (const row of statementImport.rows) {
            const recomputed = previewRows.find((previewRow) => previewRow.rowNumber === row.rowNumber);
            if (!recomputed) continue;

            await tx.statementImportRow.update({
                where: { id: row.id },
                data: {
                    reference: recomputed.reference,
                    payerName: recomputed.payerName,
                    description: recomputed.description,
                    amount: recomputed.amount,
                    transactionDate: recomputed.transactionDate,
                    matchState: recomputed.matchState,
                    suggestions: recomputed.suggestions,
                },
            });
        }

        return tx.statementImport.findUnique({
            where: { id: importId },
            include: {
                rows: {
                    orderBy: { rowNumber: 'asc' },
                },
            },
        });
    });

    return serializeImport(updated);
};

export const markStatementImportRowResolved = async (importId: string, rowId: string, paymentId: string) => {
    const row = await prisma.statementImportRow.findFirst({
        where: {
            id: rowId,
            importId,
        },
    });

    if (!row) {
        throw new AppError('Statement row not found', 404);
    }

    await prisma.statementImportRow.update({
        where: { id: rowId },
        data: {
            resolvedPaymentId: paymentId,
            reconciledAt: new Date(),
        },
    });

    return getStatementImportById(importId);
};

export const tryAutoApprovePaymentFromStatementMatch = async (paymentId: string, actorId: string) => {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
            student: {
                include: {
                    user: true,
                },
            },
        },
    });

    if (!payment) {
        throw new AppError('Payment not found', 404);
    }

    if (payment.status !== PaymentStatus.PENDING) {
        return null;
    }

    const normalizedReference = normalizeText(payment.externalReference || payment.receiptNumber);
    const normalizedAmount = normalizeAmount(payment.amount);

    if (!normalizedReference || !normalizedAmount) {
        return null;
    }

    const unresolvedRows = await prisma.statementImportRow.findMany({
        where: {
            resolvedPaymentId: null,
        },
        include: {
            statementImport: true,
        },
        orderBy: [
            { reconciledAt: 'asc' },
            { rowNumber: 'asc' },
        ],
    });

    const matchingRow = unresolvedRows.find((row) => (
        normalizeText(row.reference) === normalizedReference &&
        normalizeAmount(row.amount) === normalizedAmount
    ));

    if (!matchingRow) {
        return null;
    }

    const reconciliationNote = [
        'Auto-approved from imported statement',
        matchingRow.statementImport.fileName ? `file: ${matchingRow.statementImport.fileName}` : null,
        matchingRow.rowNumber ? `row: ${matchingRow.rowNumber}` : null,
        matchingRow.reference ? `reference: ${matchingRow.reference}` : null,
        matchingRow.amount ? `amount: ${Number(matchingRow.amount).toFixed(2)}` : null,
    ]
        .filter(Boolean)
        .join(' | ');

    await prisma.$transaction(async (tx) => {
        await tx.payment.update({
            where: { id: paymentId },
            data: {
                reconciliationStatus: ReconciliationStatus.MATCHED,
                reconciliationNote,
                reconciledAt: new Date(),
                reconciledBy: actorId,
                verificationStatus: VerificationStatus.VERIFIED,
                verificationNotes: 'Automatically verified after an exact statement match on reference and amount.',
                verifiedAt: new Date(),
                verifiedBy: actorId,
                status: PaymentStatus.APPROVED,
                reviewNotes: 'Automatically approved after an exact statement match on reference and amount.',
                reviewedAt: new Date(),
                reviewerId: actorId,
            },
        });

        await tx.statementImportRow.update({
            where: { id: matchingRow.id },
            data: {
                resolvedPaymentId: paymentId,
                autoApprovedPaymentId: paymentId,
                reconciledAt: new Date(),
                matchState: 'STRONG_MATCH',
            },
        });
    });

    await recalculateStudentBalance(payment.studentId);

    writeAuditLog({
        action: 'payment.auto_approved_from_statement_submission',
        actor: {
            userId: actorId,
            role: 'STUDENT',
        },
        targetType: 'payment',
        targetId: paymentId,
        details: {
            studentId: payment.studentId,
            statementRowId: matchingRow.id,
            importId: matchingRow.importId,
            reference: matchingRow.reference,
            amount: Number(matchingRow.amount || 0),
        },
    });

    return {
        paymentId,
        rowId: matchingRow.id,
        importId: matchingRow.importId,
    };
};

export const listReconciliationExceptions = async () => {
    const rows = await prisma.statementImportRow.findMany({
        where: {
            resolvedPaymentId: null,
        },
        include: {
            statementImport: {
                select: {
                    id: true,
                    fileName: true,
                    uploadedAt: true,
                },
            },
        },
        orderBy: [
            { transactionDate: 'desc' },
            { rowNumber: 'asc' },
        ],
        take: 250,
    });

    const exceptions = rows
        .map((row) => {
            const suggestions = (row.suggestions as any[]) || [];
            const topSuggestion = suggestions[0];
            const secondSuggestion = suggestions[1];

            let exceptionType: 'NO_MATCH' | 'MULTIPLE_MATCHES' | 'NEAR_AUTO_APPROVE' | null = null;
            let reason = '';

            if (row.matchState === 'NO_MATCH' || suggestions.length === 0) {
                exceptionType = 'NO_MATCH';
                reason = 'No pending payment matched this statement row.';
            } else if (
                suggestions.length > 1 &&
                topSuggestion &&
                secondSuggestion &&
                Number(topSuggestion.score || 0) === Number(secondSuggestion.score || 0)
            ) {
                exceptionType = 'MULTIPLE_MATCHES';
                reason = 'Multiple student payments scored similarly and need staff judgment.';
            } else if (
                topSuggestion &&
                Number(topSuggestion.score || 0) >= 40 &&
                Number(topSuggestion.score || 0) < 100 &&
                !topSuggestion.canAutoApprove
            ) {
                exceptionType = 'NEAR_AUTO_APPROVE';
                reason = 'This row matched either the exact reference or the exact amount, but not both yet.';
            }

            if (!exceptionType) return null;

            return {
                id: row.id,
                importId: row.statementImport.id,
                importFileName: row.statementImport.fileName,
                importedAt: row.statementImport.uploadedAt,
                rowNumber: row.rowNumber,
                reference: row.reference,
                payerName: row.payerName,
                description: row.description,
                amount: Number(row.amount || 0),
                transactionDate: row.transactionDate,
                matchState: row.matchState,
                exceptionType,
                reason,
                suggestions,
                topSuggestion,
            };
        })
        .filter(Boolean);

    const summary = {
        total: exceptions.length,
        noMatch: exceptions.filter((item: any) => item.exceptionType === 'NO_MATCH').length,
        multipleMatches: exceptions.filter((item: any) => item.exceptionType === 'MULTIPLE_MATCHES').length,
        nearAutoApprove: exceptions.filter((item: any) => item.exceptionType === 'NEAR_AUTO_APPROVE').length,
    };

    return {
        summary,
        items: exceptions,
    };
};

export const assistApproveStatementImportRow = async (importId: string, rowId: string, paymentId: string, actorId: string) => {
    const statementRow = await prisma.statementImportRow.findFirst({
        where: {
            id: rowId,
            importId,
        },
        include: {
            statementImport: true,
        },
    });

    if (!statementRow) {
        throw new AppError('Statement row not found', 404);
    }

    const suggestions = (statementRow.suggestions as any[]) || [];
    const suggestion = suggestions.find((item) => item.id === paymentId);

    if (!suggestion) {
        throw new AppError('Suggested payment not found for this statement row', 404);
    }

    if (!canAutoApproveSuggestion(suggestion)) {
        throw new AppError('This suggestion does not meet the auto-approval guardrails', 409);
    }

    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
            student: {
                include: {
                    user: true,
                },
            },
        },
    });

    if (!payment) {
        throw new AppError('Payment not found', 404);
    }

    if (payment.status !== PaymentStatus.PENDING) {
        throw new AppError('Only pending payments can be auto-approved', 409);
    }

    const reconciliationNote = [
        'Auto-approved from imported statement',
        statementRow.statementImport.fileName ? `file: ${statementRow.statementImport.fileName}` : null,
        statementRow.rowNumber ? `row: ${statementRow.rowNumber}` : null,
        statementRow.reference ? `reference: ${statementRow.reference}` : null,
        statementRow.payerName ? `name: ${statementRow.payerName}` : null,
        statementRow.transactionDate ? `date: ${statementRow.transactionDate.toISOString()}` : null,
    ]
        .filter(Boolean)
        .join(' | ');

    const verificationNote = `Auto-verified after strong statement match: ${suggestion.reasons.join(', ')}.`;

    await prisma.$transaction(async (tx) => {
        await tx.payment.update({
            where: { id: paymentId },
            data: {
                reconciliationStatus: ReconciliationStatus.MATCHED,
                reconciliationNote,
                reconciledAt: new Date(),
                reconciledBy: actorId,
                verificationStatus: VerificationStatus.VERIFIED,
                verificationNotes: verificationNote,
                verifiedAt: new Date(),
                verifiedBy: actorId,
                status: PaymentStatus.APPROVED,
                reviewNotes: 'Approved with staff confirmation after strong statement match.',
                reviewedAt: new Date(),
                reviewerId: actorId,
            },
        });

        await tx.statementImportRow.update({
            where: { id: rowId },
            data: {
                resolvedPaymentId: paymentId,
                autoApprovedPaymentId: paymentId,
                reconciledAt: new Date(),
            },
        });
    });

    await recalculateStudentBalance(payment.studentId);

    writeAuditLog({
        action: 'payment.auto_approved_from_statement',
        actor: {
            userId: actorId,
            role: 'ACCOUNTS',
        },
        targetType: 'payment',
        targetId: paymentId,
        details: {
            studentId: payment.studentId,
            importId,
            statementRowId: rowId,
            reasons: suggestion.reasons,
            score: suggestion.score,
        },
    });

    await createNotification({
        userId: payment.student.userId,
        title: 'Payment Approved',
        message: `Your payment of MK ${Number(payment.amount).toLocaleString()} has been approved after statement verification.`,
        type: 'PAYMENT_APPROVED',
    });

    return getStatementImportById(importId);
};
