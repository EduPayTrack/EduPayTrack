import type { PaymentMethod } from './api';

export type RegisterFormState = {
  email: string;
  password: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  program: string;
  classLevel: string;
  academicYear: string;
  phone: string;
  profilePicUrl?: string;
};

export type LoginFormState = {
  email: string;
  password: string;
};

export type PaymentFormState = {
  amount: string;
  method: PaymentMethod;
  paymentDate: string;
  externalReference: string;
  receiptNumber: string;
  registrationNumber: string;
  codeNumber: string;
  payerName: string;
  notes: string;
  proofUrl: string;
};

export const initialRegisterForm: RegisterFormState = {
  email: '',
  password: '',
  studentCode: '',
  firstName: '',
  lastName: '',
  program: '',
  classLevel: '',
  academicYear: '',
  phone: '',
  profilePicUrl: '',
};

export const initialLoginForm: LoginFormState = {
  email: '',
  password: '',
};

export const initialPaymentForm: PaymentFormState = {
  amount: '',
  method: 'BANK',
  paymentDate: '',
  externalReference: '',
  receiptNumber: '',
  registrationNumber: '',
  codeNumber: '',
  payerName: '',
  notes: '',
  proofUrl: '',
};
