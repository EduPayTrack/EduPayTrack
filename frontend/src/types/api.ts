export type AuthMode = 'login' | 'register';
export type PaymentMethod = 'BANK_TRANSFER' | 'MOBILE_CREDIT_CARD' | 'CASH';
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type VerificationStatus = 'UNVERIFIED' | 'VERIFIED' | 'FLAGGED';
export type UserRole = 'ADMIN' | 'STUDENT' | 'ACCOUNTS';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
export type AuditStatus = 'VERIFIED' | 'FAILED' | 'SYSTEM_REJECTED' | 'SUCCESS';

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  profilePictureUrl: string | null;
  student?: {
    id: string;
    studentCode: string;
    firstName: string;
    lastName: string;
  } | null;
};

export type AuditActor = {
  userId?: string;
  email?: string;
  role?: UserRole;
  ipAddress?: string;
};

export type AuditLogEntry = {
  id: string; // Unique ID for manual deletion
  timestamp: string;
  action: string;
  actor?: AuditActor;
  targetType?: string;
  targetId?: string;
  status?: AuditStatus;
  reason?: string;
  details?: Record<string, unknown>;
};

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
  verificationStatus: VerificationStatus;
  paymentDate: string;
  submittedAt: string;
  proofUrl: string;
  duplicateFlag: boolean;
  externalReference?: string | null;
  receiptNumber?: string | null;
  payerName?: string | null;
  notes?: string | null;
  verificationNotes?: string | null;
  reviewNotes?: string | null;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  reviewedAt?: string | null;
  reviewerId?: string | null;
  ocrAmount?: number | null;
  ocrReference?: string | null;
  ocrText?: string| null;
  verifier?: {
    id: string;
    email: string;
    role: UserRole;
  } | null;
  reviewer?: {
    id: string;
    email: string;
    role: UserRole;
  } | null;
  academicYear?: string | null;
  term?: string | null;
  semester?: string | null;
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
    firstName?: string;
    lastName?: string;
    role: UserRole;
    student?: StudentProfile;
    profilePictureUrl?: string | null;
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

export type SystemUser = User;

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
  installmentMetrics?: {
    fullPaymentPercentage: number;
    installmentPercentage: number;
  };
  recentPayments: PaymentRecord[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
};

export type SystemRegistry = {
  id: string;
  institutionName: string;
  institutionType: string;
  address?: string | null;
  logoUrl?: string | null;
  contactEmail?: string | null;
  updatedAt: string;
};
