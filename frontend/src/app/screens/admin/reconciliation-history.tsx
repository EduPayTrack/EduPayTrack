import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Download,
  FileSpreadsheet,
  History,
  RotateCw,
  Sparkles,
  Link2,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  getStatementImport,
  listStatementImports,
  type StatementImportRecord,
  type StatementImportRow,
} from '../../lib/admin-payments-api';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Skeleton } from '../../../components/ui/skeleton';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/table';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { StatementImportSummaryCards } from '../../components/admin/statement-import-summary-cards';
import { exportCsv } from '../../lib/csv-export';
import { SearchInput } from '../../components/common/search-input';

export function ReconciliationHistoryPage() {
  const [searchParams] = useSearchParams();
  const [imports, setImports] = useState<StatementImportRecord[]>([]);
  const [selectedImport, setSelectedImport] = useState<StatementImportRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadImports = async () => {
    setLoading(true);
    try {
      const result = await listStatementImports();
      setImports(result || []);
      const requestedImportId = searchParams.get('importId');
      if (requestedImportId && result?.some((item) => item.id === requestedImportId)) {
        void loadImportDetail(requestedImportId);
      } else if (!selectedImport && result?.[0]?.id) {
        void loadImportDetail(result[0].id);
      }
    } catch {
      toast.error('Failed to load reconciliation history');
    } finally {
      setLoading(false);
    }
  };

  const loadImportDetail = async (importId: string) => {
    setDetailLoading(true);
    try {
      const result = await getStatementImport(importId);
      setSelectedImport(result);
    } catch {
      toast.error('Failed to load statement import details');
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    void loadImports();
  }, [searchParams]);

  const filteredRows = useMemo(() => {
    if (!selectedImport?.rows) return [];
    const query = search.trim().toLowerCase();
    if (!query) return selectedImport.rows;

    return selectedImport.rows.filter((row: StatementImportRow) =>
      row.reference?.toLowerCase().includes(query) ||
      row.payerName?.toLowerCase().includes(query) ||
      row.description?.toLowerCase().includes(query) ||
      row.suggestions?.some((suggestion) =>
        `${suggestion.student?.firstName || ''} ${suggestion.student?.lastName || ''}`.toLowerCase().includes(query) ||
        suggestion.student?.studentCode?.toLowerCase().includes(query)
      )
    );
  }, [selectedImport, search]);

  const exportSelectedImport = () => {
    if (!selectedImport) return;

    const headers = [
      'Row',
      'Reference',
      'Payer Name',
      'Amount',
      'Transaction Date',
      'Match State',
      'Resolved Payment ID',
      'Auto Approved Payment ID',
      'Top Suggestion Student',
      'Top Suggestion Score',
      'Top Suggestion Reasons',
    ];

    const rows = (selectedImport.rows || []).map((row: StatementImportRow) => [
      row.rowNumber,
      row.reference || '',
      row.payerName || '',
      row.amount || 0,
      row.transactionDate ? formatDate(row.transactionDate) : '',
      row.matchState || '',
      row.resolvedPaymentId || '',
      row.autoApprovedPaymentId || '',
      row.suggestions?.[0]?.student
        ? `${row.suggestions[0].student.firstName} ${row.suggestions[0].student.lastName}`
        : '',
      row.suggestions?.[0]?.score || '',
      row.suggestions?.[0]?.reasons?.join(' | ') || '',
    ]);

    exportCsv({
      headers,
      rows,
      fileName: `reconciliation-history-${selectedImport.fileName || selectedImport.id}.csv`,
    });
    toast.success('Reconciliation history exported');
  };

  return (
    <div className="max-w-[1400px] animate-fade-in space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-foreground">Reconciliation History</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Review imported statements, resolved matches, and assisted approvals in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2" onClick={() => void loadImports()} disabled={loading}>
            <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-2" onClick={exportSelectedImport} disabled={!selectedImport}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardContent className="space-y-4 p-4">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-[14px] font-medium">Imported Statements</h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => <Skeleton key={item} className="h-20 rounded-lg" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {imports.length > 0 ? (
                  imports.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`w-full rounded-xl border p-3 text-left transition-colors hover:bg-muted/30 ${
                        selectedImport?.id === item.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => void loadImportDetail(item.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[13px] font-medium">{item.fileName}</p>
                          <p className="mt-1 text-[11px] text-muted-foreground">{new Date(item.uploadedAt).toLocaleString()}</p>
                        </div>
                        <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                        <div className="rounded-lg bg-muted/30 px-2 py-1.5">
                          <p className="text-muted-foreground">Strong</p>
                          <p className="font-medium text-success">{item.summary?.strongMatches || 0}</p>
                        </div>
                        <div className="rounded-lg bg-muted/30 px-2 py-1.5">
                          <p className="text-muted-foreground">Possible</p>
                          <p className="font-medium text-warning">{item.summary?.possibleMatches || 0}</p>
                        </div>
                        <div className="rounded-lg bg-muted/30 px-2 py-1.5">
                          <p className="text-muted-foreground">Rows</p>
                          <p className="font-medium">{item.rowCount || item.totalRows || 0}</p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-[12px] text-muted-foreground">No saved statement imports yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {detailLoading ? (
            <Skeleton className="h-[420px] rounded-xl" />
          ) : selectedImport ? (
            <>
              <StatementImportSummaryCards
                totalRows={selectedImport.summary?.totalRows || 0}
                strongMatches={selectedImport.summary?.strongMatches || 0}
                possibleMatches={selectedImport.summary?.possibleMatches || 0}
                totalAmount={Number(selectedImport.totalAmount || selectedImport.summary?.totalAmount || 0)}
              />

              <Card>
                <CardContent className="space-y-4 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-[15px] font-semibold">{selectedImport.fileName}</h2>
                      <p className="mt-1 text-[12px] text-muted-foreground">
                        Imported on {new Date(selectedImport.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                    <SearchInput
                      placeholder="Search rows or students..."
                      value={search}
                      onChange={setSearch}
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Payer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Match</TableHead>
                          <TableHead>Top Suggestion</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRows.map((row: StatementImportRow) => (
                          <TableRow key={row.id}>
                            <TableCell className="text-[12px]">{row.rowNumber}</TableCell>
                            <TableCell className="text-[12px] font-mono">{row.reference || 'N/A'}</TableCell>
                            <TableCell className="text-[12px]">{row.payerName || 'N/A'}</TableCell>
                            <TableCell className="text-[12px] font-medium">{formatCurrency(Number(row.amount || 0))}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${
                                  row.matchState === 'STRONG_MATCH'
                                    ? 'bg-success/10 text-success border-success/20'
                                    : row.matchState === 'POSSIBLE_MATCH'
                                      ? 'bg-warning/10 text-warning border-warning/20'
                                      : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {row.matchState === 'STRONG_MATCH'
                                  ? 'Strong Match'
                                  : row.matchState === 'POSSIBLE_MATCH'
                                    ? 'Possible Match'
                                    : 'No Match'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[12px]">
                              {row.suggestions?.[0] ? (
                                <div>
                                  <p className="font-medium">
                                    {row.suggestions[0].student?.firstName} {row.suggestions[0].student?.lastName}
                                  </p>
                                  <p className="text-muted-foreground">score {row.suggestions[0].score}</p>
                                </div>
                              ) : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-2">
                                {row.resolvedPaymentId && (
                                  <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/20">
                                    <Link2 className="mr-1 h-3 w-3" />
                                    Reconciled
                                  </Badge>
                                )}
                                {row.autoApprovedPaymentId && (
                                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                                    <Sparkles className="mr-1 h-3 w-3" />
                                    Assisted Approval
                                  </Badge>
                                )}
                                {!row.resolvedPaymentId && !row.autoApprovedPaymentId && (
                                  <span className="text-[12px] text-muted-foreground">Open</span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredRows.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                              No rows matched your search.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex min-h-[320px] items-center justify-center text-center">
                <div className="space-y-2">
                  <History className="mx-auto h-8 w-8 text-muted-foreground/60" />
                  <p className="text-[13px] font-medium">Select a statement import to review its history</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
