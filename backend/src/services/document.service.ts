import PDFDocument from 'pdfkit';

import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error-handler';
import { recalculateStudentBalance } from '../utils/balance';

type StudentDocumentPayload = {
    registry: {
        institutionName: string;
        institutionType: string;
        address?: string | null;
        contactEmail?: string | null;
    };
    student: {
        id: string;
        studentCode: string;
        firstName: string;
        lastName: string;
        program: string;
        classLevel?: string | null;
        academicYear?: string | null;
        term?: string | null;
        semester?: string | null;
        currentBalance: number;
        email?: string | null;
    };
    summary: {
        totalPaid: number;
        installmentCount: number;
        pendingVerifications: number;
        rejectedSubmissions: number;
        currentBalance: number;
    };
    payments: Array<{
        id: string;
        amount: number;
        method: string;
        paymentDate: Date;
        submittedAt: Date;
        status: string;
        receiptNumber?: string | null;
        externalReference?: string | null;
    }>;
};

const formatCurrency = (amount: number) => `MWK ${amount.toLocaleString()}`;

const formatDate = (value: Date) =>
    new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(value);

const buildPdfBuffer = (draw: (doc: PDFKit.PDFDocument) => void) =>
    new Promise<Buffer>((resolve, reject) => {
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
            info: {
                Producer: 'EduPayTrack',
            },
        });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        draw(doc);
        doc.end();
    });

const drawDocumentHeader = (
    doc: PDFKit.PDFDocument,
    payload: StudentDocumentPayload,
    title: string,
    subtitle: string
) => {
    doc.fillColor('#111827').fontSize(20).font('Helvetica-Bold').text(payload.registry.institutionName || 'EduPayTrack');
    doc.moveDown(0.2);
    doc.fillColor('#6B7280').fontSize(10).font('Helvetica').text(payload.registry.institutionType || 'Institution');

    if (payload.registry.address) {
        doc.text(payload.registry.address);
    }

    if (payload.registry.contactEmail) {
        doc.text(payload.registry.contactEmail);
    }

    doc.moveDown(1);
    doc.fillColor('#0F172A').fontSize(18).font('Helvetica-Bold').text(title);
    doc.moveDown(0.2);
    doc.fillColor('#475569').fontSize(11).font('Helvetica').text(subtitle);
    doc.moveDown(1);
};

const drawMetaGrid = (doc: PDFKit.PDFDocument, rows: Array<[string, string]>) => {
    const startX = doc.x;
    const startY = doc.y;
    const columnWidth = 240;
    const rowHeight = 40;

    rows.forEach(([label, value], index) => {
        const column = index % 2;
        const row = Math.floor(index / 2);
        const x = startX + column * (columnWidth + 12);
        const y = startY + row * rowHeight;

        doc
            .roundedRect(x, y, columnWidth, 32, 6)
            .fillAndStroke('#F8FAFC', '#E2E8F0');

        doc
            .fillColor('#64748B')
            .fontSize(8)
            .font('Helvetica-Bold')
            .text(label.toUpperCase(), x + 10, y + 7, { width: columnWidth - 20 });

        doc
            .fillColor('#0F172A')
            .fontSize(10)
            .font('Helvetica')
            .text(value, x + 10, y + 17, { width: columnWidth - 20 });
    });

    doc.moveDown(Math.ceil(rows.length / 2) * 1.9);
};

const drawSummaryCards = (doc: PDFKit.PDFDocument, payload: StudentDocumentPayload) => {
    const cards = [
        ['Total Paid', formatCurrency(payload.summary.totalPaid)],
        ['Current Balance', formatCurrency(payload.summary.currentBalance)],
        ['Approved Payments', String(payload.summary.installmentCount)],
        ['Pending Reviews', String(payload.summary.pendingVerifications)],
    ];
    const startX = doc.x;
    const startY = doc.y;
    const cardWidth = 115;

    cards.forEach(([label, value], index) => {
        const x = startX + index * (cardWidth + 10);
        doc.roundedRect(x, startY, cardWidth, 52, 8).fillAndStroke('#F8FAFC', '#E2E8F0');
        doc.fillColor('#64748B').fontSize(8).font('Helvetica-Bold').text(label.toUpperCase(), x + 10, startY + 10, { width: cardWidth - 20 });
        doc.fillColor('#0F172A').fontSize(12).font('Helvetica-Bold').text(value, x + 10, startY + 25, { width: cardWidth - 20 });
    });

    doc.moveDown(3.2);
};

const drawStatementTable = (doc: PDFKit.PDFDocument, payload: StudentDocumentPayload) => {
    doc.fillColor('#0F172A').fontSize(14).font('Helvetica-Bold').text('Payment History & Running Balance');
    doc.moveDown(0.3);
    doc.fillColor('#64748B').fontSize(9).font('Helvetica').text('All amounts in MWK (Malawian Kwacha)');
    doc.moveDown(0.5);

    const columns = [
        { label: 'Date', width: 70 },
        { label: 'Reference/Receipt', width: 130 },
        { label: 'Description', width: 110 },
        { label: 'Amount (MWK)', width: 85, align: 'right' },
        { label: 'Status', width: 65 },
        { label: 'Balance (MWK)', width: 85, align: 'right' },
    ];

    const startX = doc.x;
    let currentY = doc.y;

    const drawHeader = () => {
        let x = startX;
        columns.forEach((column) => {
            doc.rect(x, currentY, column.width, 24).fillAndStroke('#1E40AF', '#1E40AF');
            doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold').text(column.label, x + 5, currentY + 8, { width: column.width - 10, align: (column.align || 'left') as 'left' | 'center' | 'right' });
            x += column.width;
        });
        currentY += 24;
    };

    drawHeader();

    // Calculate running balance
    let runningBalance = payload.summary.totalPaid;
    const approvedPayments = payload.payments.filter(p => p.status === 'APPROVED');
    
    // Sort payments by date ascending for running balance
    const sortedPayments = [...payload.payments].sort((a, b) => {
        const dateA = new Date(a.paymentDate || a.submittedAt).getTime();
        const dateB = new Date(b.paymentDate || b.submittedAt).getTime();
        return dateA - dateB;
    });

    sortedPayments.forEach((payment, index) => {
        if (currentY > 680) {
            doc.addPage();
            currentY = 60;
            doc.fillColor('#1E40AF').fontSize(10).font('Helvetica-Bold').text('Payment History (continued)', 50, currentY);
            currentY += 20;
            drawHeader();
        }

        // Update running balance for approved payments
        if (payment.status === 'APPROVED') {
            runningBalance -= payment.amount;
        }

        const description = payment.method.replace(/_/g, ' ') + (payment.status !== 'APPROVED' ? ` (${payment.status})` : '');
        const balanceDisplay = payment.status === 'APPROVED' ? formatCurrency(Math.max(0, runningBalance)).replace('MWK ', '') : '-';
        const amountDisplay = formatCurrency(payment.amount).replace('MWK ', '');

        const rowValues = [
            formatDate(payment.paymentDate || payment.submittedAt),
            payment.receiptNumber || payment.externalReference || 'N/A',
            description,
            amountDisplay,
            payment.status,
            balanceDisplay,
        ];

        // Status colors
        const statusColors: Record<string, string> = {
            'APPROVED': '#059669',
            'PENDING': '#D97706',
            'REJECTED': '#DC2626',
        };

        let x = startX;
        rowValues.forEach((value, valueIndex) => {
            const isStatusCol = valueIndex === 4;
            const bgColor = index % 2 === 0 ? '#FFFFFF' : '#F1F5F9';
            
            doc
                .rect(x, currentY, columns[valueIndex].width, 26)
                .fillAndStroke(bgColor, '#E2E8F0');

            if (isStatusCol) {
                doc.fillColor(statusColors[value] || '#374151').fontSize(8).font('Helvetica-Bold');
            } else {
                doc.fillColor('#0F172A').fontSize(8).font('Helvetica');
            }
            
            doc
                .text(value, x + 5, currentY + 9, { width: columns[valueIndex].width - 10, align: (columns[valueIndex].align || 'left') as 'left' | 'center' | 'right', ellipsis: true });

            x += columns[valueIndex].width;
        });

        currentY += 26;
    });

    if (payload.payments.length === 0) {
        doc
            .roundedRect(startX, currentY, 545, 50, 8)
            .fillAndStroke('#FEF3C7', '#F59E0B');
        doc.fillColor('#92400E').fontSize(10).font('Helvetica').text('No payment activity recorded yet.', startX + 15, currentY + 20);
    }

    // Summary footer
    doc.moveDown(1);
    currentY = doc.y;
    
    doc.roundedRect(startX, currentY, 545, 70, 8).fillAndStroke('#EFF6FF', '#3B82F6');
    
    doc.fillColor('#1E40AF').fontSize(10).font('Helvetica-Bold').text('SUMMARY', startX + 15, currentY + 12);
    
    const summaryItems = [
        ['Total Amount Paid:', formatCurrency(payload.summary.totalPaid)],
        ['Current Outstanding Balance:', formatCurrency(payload.summary.currentBalance)],
        ['Total Payments Made:', `${payload.summary.installmentCount} transaction${payload.summary.installmentCount !== 1 ? 's' : ''}`],
    ];

    let summaryY = currentY + 30;
    summaryItems.forEach(([label, value]) => {
        doc.fillColor('#475569').fontSize(9).font('Helvetica').text(label, startX + 15, summaryY);
        doc.fillColor('#0F172A').fontSize(9).font('Helvetica-Bold').text(value, startX + 200, summaryY);
        summaryY += 14;
    });
};

export const getStudentDocumentPayloadByStudentId = async (studentId: string): Promise<StudentDocumentPayload> => {
    const [registry, student] = await Promise.all([
        prisma.systemRegistry.findFirst(),
        prisma.student.findUnique({
            where: { id: studentId },
            include: {
                user: true,
                payments: {
                    orderBy: [
                        { submittedAt: 'desc' },
                        { paymentDate: 'desc' },
                    ],
                },
            },
        }),
    ]);

    if (!student) {
        throw new AppError('Student not found', 404);
    }

    const updatedStudent = await recalculateStudentBalance(student.id);
    const approvedPayments = student.payments.filter((payment) => payment.status === 'APPROVED');
    const pendingPayments = student.payments.filter((payment) => payment.status === 'PENDING');
    const rejectedPayments = student.payments.filter((payment) => payment.status === 'REJECTED');

    return {
        registry: {
            institutionName: registry?.institutionName || 'EduPayTrack',
            institutionType: registry?.institutionType || 'Institution',
            address: registry?.address,
            contactEmail: registry?.contactEmail,
        },
        student: {
            id: student.id,
            studentCode: student.studentCode,
            firstName: student.firstName,
            lastName: student.lastName,
            program: student.program,
            classLevel: student.classLevel,
            academicYear: student.academicYear,
            term: student.term,
            semester: student.semester,
            currentBalance: Number(updatedStudent.currentBalance),
            email: student.user.email,
        },
        summary: {
            totalPaid: approvedPayments.reduce((sum, payment) => sum + Number(payment.amount), 0),
            installmentCount: approvedPayments.length,
            pendingVerifications: pendingPayments.length,
            rejectedSubmissions: rejectedPayments.length,
            currentBalance: Number(updatedStudent.currentBalance),
        },
        payments: student.payments.map((payment) => ({
            id: payment.id,
            amount: Number(payment.amount),
            method: payment.method,
            paymentDate: payment.paymentDate,
            submittedAt: payment.submittedAt,
            status: payment.status,
            receiptNumber: payment.receiptNumber,
            externalReference: payment.externalReference,
        })),
    };
};

export const getStudentDocumentPayloadByUserId = async (userId: string) => {
    const student = await prisma.student.findFirst({
        where: { userId },
        select: { id: true },
    });

    if (!student) {
        throw new AppError('Student profile not found', 404);
    }

    return getStudentDocumentPayloadByStudentId(student.id);
};

const drawQrCode = (doc: PDFKit.PDFDocument, studentId: string) => {
    // Simple QR-like representation with verification URL
    const size = 60;
    const x = doc.page.width - size - 60;
    const y = 50;
    
    doc.roundedRect(x, y, size, size, 4).stroke('#CBD5E1');
    doc.fillColor('#1E40AF').fontSize(8).font('Helvetica-Bold');
    doc.text('VERIFY', x + 15, y + 25, { width: size - 10, align: 'center' });
    doc.fontSize(6).font('Helvetica');
    doc.text(`ID: ${studentId.slice(-8)}`, x + 5, y + 40, { width: size - 10, align: 'center' });
    doc.moveDown(2);
};

const drawOfficialFooter = (doc: PDFKit.PDFDocument, currentPage: number, totalPages: number) => {
    const footerY = doc.page.height - 80;
    
    // Separator line
    doc.moveTo(50, footerY - 10).lineTo(545, footerY - 10).stroke('#E2E8F0');
    
    // Official stamp area
    doc.roundedRect(50, footerY, 150, 50, 4).stroke('#CBD5E1');
    doc.fillColor('#64748B').fontSize(7).font('Helvetica');
    doc.text('OFFICIAL STAMP', 55, footerY + 8);
    doc.fillColor('#94A3B8').fontSize(6);
    doc.text('Accounts Office', 55, footerY + 22);
    doc.text('Date: ____________', 55, footerY + 35);
    
    // Signature area
    doc.roundedRect(220, footerY, 150, 50, 4).stroke('#CBD5E1');
    doc.fillColor('#64748B').fontSize(7).font('Helvetica');
    doc.text('AUTHORIZED SIGNATURE', 225, footerY + 8);
    doc.fillColor('#94A3B8').fontSize(6);
    doc.text('Accounts Officer', 225, footerY + 22);
    doc.text('Signature: ____________', 225, footerY + 35);
    
    // Verification note
    doc.fillColor('#64748B').fontSize(7).font('Helvetica');
    doc.text(
        'This is a computer-generated statement. For verification, contact the Accounts Office.',
        400, footerY + 20, { width: 145, align: 'left' }
    );
    
    // Page number
    doc.fillColor('#94A3B8').fontSize(8).font('Helvetica');
    doc.text(`Page ${currentPage} of ${totalPages}`, doc.page.width / 2, footerY + 60, { align: 'center' });
};

const drawTermsSection = (doc: PDFKit.PDFDocument) => {
    doc.moveDown(2);
    doc.fillColor('#1E40AF').fontSize(10).font('Helvetica-Bold').text('Terms & Conditions');
    doc.moveDown(0.3);
    doc.fillColor('#475569').fontSize(8).font('Helvetica');
    doc.text(
        '1. This statement reflects payments received and processed by the Accounts Office.\n' +
        '2. All amounts are in Malawian Kwacha (MWK).\n' +
        '3. Pending payments are subject to verification.\n' +
        '4. Please retain your original receipts for reference.\n' +
        '5. For discrepancies, contact accounts@institution.mw within 30 days.',
        { lineGap: 2 }
    );
};

export const generateStudentStatementPdf = async (studentId: string) => {
    const payload = await getStudentDocumentPayloadByStudentId(studentId);

    return buildPdfBuffer((doc) => {
        drawDocumentHeader(
            doc,
            payload,
            'Student Fee Statement',
            `Generated on ${formatDate(new Date())} for ${payload.student.firstName} ${payload.student.lastName}.`
        );

        drawQrCode(doc, studentId);

        drawMetaGrid(doc, [
            ['Student Name', `${payload.student.firstName} ${payload.student.lastName}`],
            ['Student ID', payload.student.studentCode],
            ['Program', payload.student.program || 'N/A'],
            ['Academic Year', payload.student.academicYear || payload.student.classLevel || 'N/A'],
            ['Email', payload.student.email || 'N/A'],
            ['Term / Semester', payload.student.term || payload.student.semester || 'N/A'],
        ]);

        drawSummaryCards(doc, payload);
        drawStatementTable(doc, payload);
        drawTermsSection(doc);
        drawOfficialFooter(doc, 1, 1);
    });
};

export const generateStudentClearanceLetterPdf = async (studentId: string) => {
    const payload = await getStudentDocumentPayloadByStudentId(studentId);

    if (payload.summary.currentBalance > 0) {
        throw new AppError('Clearance letter is only available for fully paid students', 409);
    }

    return buildPdfBuffer((doc) => {
        drawDocumentHeader(
            doc,
            payload,
            'Fee Clearance Letter',
            `Official confirmation of fee clearance issued on ${formatDate(new Date())}.`
        );

        doc
            .fillColor('#0F172A')
            .fontSize(12)
            .font('Helvetica')
            .text(
                `This letter confirms that ${payload.student.firstName} ${payload.student.lastName} (${payload.student.studentCode}) has fully settled the required school fees and is financially cleared.`,
                { lineGap: 5 }
            );

        doc.moveDown(1.2);

        drawMetaGrid(doc, [
            ['Student Name', `${payload.student.firstName} ${payload.student.lastName}`],
            ['Student ID', payload.student.studentCode],
            ['Program', payload.student.program || 'N/A'],
            ['Academic Year', payload.student.academicYear || payload.student.classLevel || 'N/A'],
            ['Total Paid', formatCurrency(payload.summary.totalPaid)],
            ['Outstanding Balance', formatCurrency(payload.summary.currentBalance)],
        ]);

        doc
            .roundedRect(doc.x, doc.y, 517, 92, 10)
            .fillAndStroke('#F8FAFC', '#CBD5E1');
        doc
            .fillColor('#0F172A')
            .fontSize(11)
            .font('Helvetica')
            .text(
                'The student is cleared for administrative and academic processes that require confirmation of fee settlement. This document was generated from EduPayTrack records.',
                doc.x + 14,
                doc.y + 18,
                { width: 489, lineGap: 4 }
            );

        doc.moveDown(6);
        doc.fillColor('#475569').fontSize(10).text('Generated electronically by EduPayTrack');
    });
};

export const getStudentDocumentFilename = (base: string, payload: { firstName: string; lastName: string; studentCode: string }) =>
    `${base}-${payload.studentCode}-${payload.firstName.toLowerCase()}-${payload.lastName.toLowerCase()}.pdf`;
