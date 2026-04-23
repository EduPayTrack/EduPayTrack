import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  CreditCard,
  FileBarChart2,
  History,
  GraduationCap,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Shield,
  Upload,
  UserCog,
  Users,
  MessageSquare,
} from 'lucide-react';

export type Role = 'student' | 'admin' | 'accounts';
export type PaymentStatus = 'Pending' | 'Approved' | 'Rejected';
export type PaymentMethod = 'National Bank Transfer' | 'Airtel Money' | 'TNM Mpamba' | 'Cash';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  studentId?: string;
  program?: string;
  year?: string;
  avatar: string;
};

export type StudentPayment = {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  status: PaymentStatus;
  receipt: string;
  detectedAmount: number;
  detectedDate: string;
};

export type StudentRecord = {
  id: string;
  name: string;
  program: string;
  year: string;
  balance: number;
  status: 'Active' | 'On Track' | 'Attention';
  email: string;
  phone: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  group: 'Today' | 'This Week' | 'Earlier';
  type: string;
  read: boolean;
};

export type FeeStructure = {
  id: string;
  program: string;
  year: string;
  term: string;
  amount: number;
  description: string;
};

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const studentUser: AppUser = {
  id: 'user-student-1',
  name: 'Thokozani Banda',
  email: 'thokozani.banda@must.ac.mw',
  role: 'student',
  studentId: 'MUST/CS/001',
  program: 'Computer Science',
  year: 'Year 3',
  avatar: 'TB',
};

export const adminUser: AppUser = {
  id: 'user-admin-1',
  name: 'Chikondi Phiri',
  email: 'accounts@edupaytrack.mw',
  role: 'admin',
  avatar: 'CP',
};

export const payments: StudentPayment[] = [
  {
    id: 'pay-1',
    date: '2026-03-27',
    amount: 450000,
    method: 'National Bank Transfer',
    reference: 'NBM-782331',
    status: 'Approved',
    receipt: 'National Bank transfer advice',
    detectedAmount: 450000,
    detectedDate: '2026-03-27',
  },
  {
    id: 'pay-2',
    date: '2026-02-10',
    amount: 275000,
    method: 'Airtel Money',
    reference: 'AIR-992170',
    status: 'Pending',
    receipt: 'Airtel Money confirmation',
    detectedAmount: 275000,
    detectedDate: '2026-02-10',
  },
  {
    id: 'pay-3',
    date: '2026-01-14',
    amount: 150000,
    method: 'TNM Mpamba',
    reference: 'TNM-114038',
    status: 'Rejected',
    receipt: 'Mpamba transfer slip',
    detectedAmount: 145000,
    detectedDate: '2026-01-14',
  },
];

export const studentRecords: StudentRecord[] = [
  {
    id: 'KW2024/0043',
    name: 'Mercy Kamwendo',
    program: 'Business Administration',
    year: 'Year 2',
    balance: 120000,
    status: 'Attention',
    email: 'mercy.kamwendo@cc.ac.mw',
    phone: '+265 999 123 450',
  },
  {
    id: 'MUST/CS/001',
    name: 'Thokozani Banda',
    program: 'Computer Science',
    year: 'Year 3',
    balance: 0,
    status: 'On Track',
    email: 'thokozani.banda@must.ac.mw',
    phone: '+265 888 111 333',
  },
  {
    id: 'UNIMA/EDU/021',
    name: 'Ruth Chisale',
    program: 'Education',
    year: 'Year 1',
    balance: 320000,
    status: 'Active',
    email: 'ruth.chisale@unima.ac.mw',
    phone: '+265 999 001 928',
  },
  {
    id: 'MZUNI/ENG/010',
    name: 'Yamikani Mvula',
    program: 'Engineering',
    year: 'Year 4',
    balance: 80000,
    status: 'On Track',
    email: 'yamikani.mvula@mzuni.ac.mw',
    phone: '+265 882 300 220',
  },
];

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Payment approved',
    description: 'Your MK 450,000 payment has been approved.',
    time: '5 minutes ago',
    group: 'Today',
    type: 'approved',
    read: false,
  },
  {
    id: 'n2',
    title: 'Deadline reminder',
    description: 'Semester 2 balance is due in 4 days.',
    time: '2 hours ago',
    group: 'Today',
    type: 'deadline',
    read: false,
  },
  {
    id: 'n3',
    title: 'Payment rejected',
    description: 'Submission TNM-114038 needs a clearer receipt image.',
    time: 'Yesterday',
    group: 'This Week',
    type: 'rejected',
    read: true,
  },
  {
    id: 'n4',
    title: 'System alert',
    description: 'OCR verification is now enabled for new uploads.',
    time: 'Last week',
    group: 'Earlier',
    type: 'system',
    read: true,
  },
];

export const deadlines = [
  { label: 'Semester 2 installment', date: '2026-04-04', daysLeft: '4 days left' },
  { label: 'Hostel fee top-up', date: '2026-04-18', daysLeft: '18 days left' },
  { label: 'Exam card clearance', date: '2026-05-02', daysLeft: '1 month left' },
];

export const revenueSeries = [
  { month: 'Apr', expected: 12.4, collected: 10.9 },
  { month: 'May', expected: 11.8, collected: 11.1 },
  { month: 'Jun', expected: 14.1, collected: 13.7 },
  { month: 'Jul', expected: 15.6, collected: 14.9 },
  { month: 'Aug', expected: 17.2, collected: 16.1 },
  { month: 'Sep', expected: 16.4, collected: 15.3 },
  { month: 'Oct', expected: 18.8, collected: 17.5 },
  { month: 'Nov', expected: 18.2, collected: 16.8 },
  { month: 'Dec', expected: 10.2, collected: 9.7 },
  { month: 'Jan', expected: 19.1, collected: 18.3 },
  { month: 'Feb', expected: 20.4, collected: 19.2 },
  { month: 'Mar', expected: 21.6, collected: 20.5 },
];

export const donutSeries = [
  { name: 'Approved', value: 68, fill: '#22c55e' },
  { name: 'Pending', value: 22, fill: '#f59e0b' },
  { name: 'Rejected', value: 10, fill: '#ef4444' },
];

export const monthlyBars = [
  { month: 'Jan', payments: 124 },
  { month: 'Feb', payments: 141 },
  { month: 'Mar', payments: 158 },
  { month: 'Apr', payments: 136 },
  { month: 'May', payments: 172 },
  { month: 'Jun', payments: 181 },
];

export const feeStructures: FeeStructure[] = [
  { id: 'fee-1', program: 'Computer Science', year: 'Year 1', term: 'Semester 1', amount: 950000, description: 'Tuition and labs' },
  { id: 'fee-2', program: 'Business Administration', year: 'Year 2', term: 'Semester 2', amount: 880000, description: 'Tuition and practicals' },
  { id: 'fee-3', program: 'Education', year: 'Year 1', term: 'Semester 1', amount: 740000, description: 'Tuition and teaching practice' },
];

export const activityFeed = [
  "Admin approved KW2024/001's payment of MK 45,000",
  "Accounts staff rejected MUST/CS/019 for reference mismatch",
  "New fee structure added for Engineering Year 2",
  '17 students marked fully paid this week',
  'Notifications digest sent to 432 students',
];

export const studentNav: NavItem[] = [
  { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Upload Payment', href: '/student/upload-payment', icon: Upload },
  { label: 'Payment History', href: '/student/payment-history', icon: CreditCard },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Notifications', href: '/student/notifications', icon: Bell },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Verify Payments', href: '/admin/verify-payments', icon: ShieldCheck },
  { label: 'Reminder Campaigns', href: '/admin/reminder-campaigns', icon: CalendarClock },
  { label: 'Reconciliation', href: '/admin/reconciliation-history', icon: History },
  { label: 'Exceptions', href: '/admin/reconciliation-exceptions', icon: AlertTriangle },
  { label: 'Students', href: '/admin/students', icon: Users },
  { label: 'Fee Structure', href: '/admin/fee-structure', icon: BriefcaseBusiness },
  { label: 'Users', href: '/admin/users', icon: UserCog },
  { label: 'Reports', href: '/admin/reports', icon: FileBarChart2 },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: Shield },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell },
  { label: 'Settings', href: '/settings', icon: Settings },
];



export const platformHighlights = [
  {
    title: 'Real-time approvals',
    description: 'Track every submission from upload to verification without spreadsheet handoffs.',
    icon: ShieldCheck,
  },
  {
    title: 'Malawi-ready reporting',
    description: 'Keep balances, terms, and payment references aligned with MWK workflows.',
    icon: GraduationCap,
  },
  {
    title: 'Deadline visibility',
    description: 'Surface outstanding balances and send reminders before exam-card pressure builds.',
    icon: CalendarClock,
  },
];
