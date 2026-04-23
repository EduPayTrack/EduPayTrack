import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate } from './utils';

export interface ReceiptData {
  id: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  method: string;
  externalReference?: string;
  receiptNumber?: string;
  paymentDate?: string;
  submittedAt?: string;
  payerName?: string;
  notes?: string;
  student?: {
    name?: string;
    email?: string;
    studentId?: string;
    program?: string;
  };
  reviewedBy?: {
    name?: string;
  };
  reviewedAt?: string;
  schoolName?: string;
}

const DEFAULT_SCHOOL_NAME = 'EduPayTrack Institution';

// Get school name from localStorage or use default
function getSchoolName(): string {
  if (typeof window === 'undefined') return DEFAULT_SCHOOL_NAME;
  return window.localStorage.getItem('edu-pay-track-school-name') || DEFAULT_SCHOOL_NAME;
}

export function generatePaymentReceipt(data: ReceiptData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  
  // Colors
  const primaryColor = [41, 98, 255]; // Blue
  const successColor = [34, 197, 94]; // Green
  const warningColor = [234, 179, 8]; // Yellow
  const destructiveColor = [239, 68, 68]; // Red
  const darkColor = [31, 41, 55]; // Dark gray
  const lightGray = [156, 163, 175]; // Light gray
  
  // Helper to get status color
  const getStatusColor = (status: string): number[] => {
    switch (status) {
      case 'APPROVED': return successColor;
      case 'REJECTED': return destructiveColor;
      default: return warningColor;
    }
  };
  
  // Header Background
  doc.setFillColor(249, 250, 251);
  doc.rect(0, 0, pageWidth, 80, 'F');
  
  // School Logo placeholder / Title
  doc.setFontSize(24);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(data.schoolName || getSchoolName(), margin, 30);
  
  // Receipt Title
  doc.setFontSize(28);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('PAYMENT RECEIPT', margin, 55);
  
  // Receipt Number
  doc.setFontSize(11);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setFont('helvetica', 'normal');
  doc.text(`Receipt #: ${data.receiptNumber || data.externalReference || data.id}`, margin, 68);
  
  // Status Badge
  const statusColor = getStatusColor(data.status);
  const statusX = pageWidth - margin - 50;
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(statusX, 48, 50, 18, 4, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(data.status, statusX + 25, 59, { align: 'center' });
  
  // Horizontal Line
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(margin, 90, pageWidth - margin, 90);
  
  // Amount Section
  doc.setFontSize(12);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setFont('helvetica', 'normal');
  doc.text('Amount Paid', margin, 110);
  
  doc.setFontSize(32);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(data.amount), margin, 130);
  
  // Payment Method
  doc.setFontSize(11);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setFont('helvetica', 'normal');
  doc.text(`via ${data.method?.replace(/_/g, ' ') || 'Unknown Method'}`, margin, 142);
  
  // Details Table
  const tableData = [
    ['Payment Date', formatDate(data.paymentDate || data.submittedAt)],
    ['Reference Number', data.externalReference || data.receiptNumber || 'N/A'],
    ['Transaction ID', data.id],
    ['Payer Name', data.payerName || data.student?.name || 'N/A'],
  ];
  
  if (data.student?.studentId) {
    tableData.push(['Student ID', data.student.studentId]);
  }
  
  if (data.student?.program) {
    tableData.push(['Program', data.student.program]);
  }
  
  if (data.notes) {
    tableData.push(['Notes', data.notes]);
  }
  
  autoTable(doc, {
    startY: 160,
    head: [['Description', 'Details']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [249, 250, 251],
      textColor: [31, 41, 55],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [75, 85, 99],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
    styles: {
      lineColor: [229, 231, 235],
      lineWidth: 0.5,
    },
  });
  
  // Approval Section (if approved)
  const finalY = (doc as any).lastAutoTable?.finalY || 200;
  
  if (data.status === 'APPROVED' && data.reviewedBy) {
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, finalY + 15, pageWidth - (margin * 2), 50, 4, 4, 'F');
    
    doc.setFontSize(11);
    doc.setTextColor(successColor[0], successColor[1], successColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('✓ VERIFIED & APPROVED', margin + 10, finalY + 32);
    
    doc.setFontSize(10);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(`Verified by: ${data.reviewedBy.name || 'Admin'}`, margin + 10, finalY + 45);
    doc.text(`Date: ${formatDate(data.reviewedAt)}`, margin + 10, finalY + 55);
  }
  
  // Footer
  const footerY = doc.internal.pageSize.height - 30;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);
  
  doc.setFontSize(9);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setFont('helvetica', 'normal');
  doc.text('This is an official receipt generated by EduPayTrack.', margin, footerY);
  doc.text('For inquiries, please contact the accounts office.', margin, footerY + 5);
  
  // Generated timestamp
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, footerY, { align: 'right' });
  
  return doc;
}

export function downloadPaymentReceipt(data: ReceiptData, filename?: string): void {
  const doc = generatePaymentReceipt(data);
  const defaultFilename = `receipt-${data.receiptNumber || data.externalReference || data.id}-${formatDate(data.paymentDate || data.submittedAt).replace(/\//g, '-')}.pdf`;
  doc.save(filename || defaultFilename);
}
