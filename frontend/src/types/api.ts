export type AuthMode = 'login' | 'register';
export type PaymentMethod = 'BANK' | 'MOBILE_MONEY' | 'CASH' | 'OTHER';
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type UserRole = 'ADMIN' | 'STUDENT' | 'ACCOUNTS';

export type StudentProfile = {
  id?: string;
  firstName: string;
  lastName: string;
  studentCode: string;
  program: string;
  currentBalance: number | string;
};

export type AdminStudentRecord = StudentProfile & {
  id: string;
  classLevel?: string | null;
  academicYear?: string | null;
  phone?: string | null;
  createdAt?: string;
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
  payments?: PaymentRecord[];
};

export type PaymentRecord = {
  id: string;
  amount: number | string;
  method: PaymentMethod;
  status: PaymentStatus;
  paymentDate: string;
  submittedAt: string;
  proofUrl: string;
  duplicateFlag: boolean;
  externalReference?: string | null;
  receiptNumber?: string | null;
  payerName?: string | null;
  notes?: string | null;
  reviewNotes?: string | null;
  student?: StudentProfile & {
    academicYear?: string | null;
    classLevel?: string | null;
  };
};

export type DashboardResponse = {
  student: StudentProfile;
  summary: {
    totalPaid: number;
    currentBalance: number;
    installmentCount: number;
    pendingVerifications: number;
    rejectedSubmissions: number;
  };
  payments: PaymentRecord[];
};

export type AuthResponse = {
  token: string;
  user: {
    id?: string;
    email: string;
    role: UserRole;
    student?: StudentProfile;
  };
};

export type UploadedReceipt = {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  extension: string;
  proofUrl: string;
};

export type OcrPreview = {
  message: string;
  rawText: string;
  amount: number | null;
  reference: string | null;
  paymentDate: string | null;
  depositorName: string | null;
  registrationNumber: string | null;
  codeNumber: string | null;
  confidence: number;
};

export type ReviewQueueResponse = PaymentRecord[];

export type SystemUser = {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  student?: {
    id: string;
    studentCode: string;
    firstName: string;
    lastName: string;
  } | null;
};

export type AuditLogEntry = {
  timestamp: string;
  action: string;
  actor?: {
    userId?: string;
    email?: string;
    role?: string;
    ipAddress?: string;
  };
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
};

export type FeeStructure = {
  id: string;
  title: string;
  description?: string | null;
  amount: number | string;
  program?: string | null;
  classLevel?: string | null;
  term?: string | null;
  semester?: string | null;
  academicYear?: string | null;
  active: boolean;
  createdAt: string;
};

export type ReportOverview = {
  summary: {
    studentsCount: number;
    pendingPayments: number;
    approvedPayments: number;
    rejectedPayments: number;
    totalApprovedAmount: number | string;
  };
  paymentMethodBreakdown: Record<string, number>;
  monthlyCollections: Record<string, number>;
  recentPayments: PaymentRecord[];
};
