# Software Requirements Specification (SRS): EduPayTrack

## 1. Introduction
### 1.1 Purpose of this Document
The purpose of this Software Requirements Specification (SRS) is to provide a detailed description of the requirements for the EduPayTrack system. This document outlines the functional and non-functional requirements, system features, constraints, and operating environment of the system. It serves as a reference for developers, testers, and stakeholders during the design, development, implementation, and testing of the system.

### 1.2 Scope of the System
**EduPayTrack** is a high-performance, web-based Institutional Payment & Fee Management System designed for educational institutions (Primary, Secondary, and Tertiary/Colleges/Universities). 

The system transitions institutions from manual, error-prone tracking (receipt books/spreadsheets) to a digital-first workflow. It allows students to upload proofs of payment from external sources (Banks, Mobile Money), which are then verified by administrators or accounts staff using AI-assisted OCR technology. Beyond tracking, the system handles bank statement reconciliation, automated debt reminders, and internal communication.

**Expected Benefits:**
*   **Reduced queues at accounts offices:** Students upload receipts remotely.
*   **Faster payment verification:** AI-driven OCR reduces manual entry and verification time.
*   **Improved financial transparency:** Real-time ledger updates and duplicate submission detection.
*   **Reduced manual record errors:** Automated balance updates based on approved proofs.
*   **Proactive debt recovery:** Automated reminders for students with outstanding balances.

### 1.3 Definitions, Acronyms, and Abbreviations
| Term | Definition |
| :--- | :--- |
| **SRS** | Software Requirements Specification |
| **OCR** | Optical Character Recognition (AI-driven text extraction) |
| **JWT** | JSON Web Token (used for stateless secure authentication) |
| **Prisma** | Modern ORM used for type-safe database interactions |
| **PostgreSQL** | Relational database management system |
| **RBAC** | Role-Based Access Control (Admin, Accounts, Student) |
| **MWK** | Malawian Kwacha (Default System Currency) |

---

## 2. Overall Description
### 2.1 System Perspective
EduPayTrack is a decoupled Client-Server application. The **React SPA** (Single Page Application) communicates with a **Node.js/Express API**, which persists data in a **PostgreSQL** database via the **Prisma ORM**.

### 2.2 System Functions
*   **Student registration and account management:** Secure onboarding with student codes.
*   **Secure login authentication:** JWT-driven access control.
*   **Payment proof upload:** Students upload scanned or photographed receipts.
*   **AI-assisted receipt verification:** OCR extracts Amount, Reference, and Payer Name.
*   **Administrator verification and approval:** Manual review queue with status tracking.
*   **Automatic balance updates:** Instant ledger updates upon payment approval.
*   **Bank statement reconciliation:** Import and auto-match bank transactions.
*   **Automated balance reminders:** Scheduled notification campaigns for debtors.
*   **Internal messaging:** Direct communication channel between students and staff.
*   **Fee structure configuration:** Manage fees by level, program, and academic term.
*   **Comprehensive audit logging:** Track all administrative actions for accountability.

### 2.3 User Classes and Characteristics
| User Class | Description | Skill Level |
| :--- | :--- | :--- |
| **Administrator** | Full system access: User management, Fee configuration, System settings, and Audit logs. | Intermediate |
| **Accounts Staff** | Focused workflow: Reviewing payment proofs and performing reconciliation. | Intermediate |
| **Student** | Self-service: Uploading receipts, viewing balance, and messaging staff. | Basic |

### 2.4 Operating Environment
*   **Operating System:** Windows, Linux, macOS
*   **Web Browser:** Google Chrome, Mozilla Firefox, Microsoft Edge
*   **Backend Technologies:** Node.js, Express, Prisma ORM, PostgreSQL
*   **Frontend Technologies:** React 18+, Vite, TypeScript, TailwindCSS
*   **Network:** Internet or Local Area Network (LAN)

### 2.5 Design and Implementation Constraints
*   The system must comply with institutional data protection and privacy policies.
*   The system must be accessible through standard modern web browsers.
*   The OCR verification feature assists administrators but does not replace final manual approval.

---

## 3. Functional Requirements
| ID | Requirement Description | Priority |
| :--- | :--- | :--- |
| **FR1** | **Student Registration:** Register using student codes or registration numbers. | High |
| **FR2** | **Secure Login:** Provide JWT-based secure authentication for all users. | High |
| **FR3** | **Payment Upload:** Allow students to upload proof of payment documents (Image/PDF). | High |
| **FR4** | **Admin Review:** Provide a dashboard for staff to review uploaded proofs. | High |
| **FR5** | **Approval/Rejection:** Allow staff to approve, reject, or flag submissions. | High |
| **FR6** | **Balance Update:** Automatically update student balance after approval. | High |
| **FR7** | **Installment Tracking:** Support and track multiple payments for a single fee. | High |
| **FR8** | **Fee Configuration:** Allow admins to configure fee structures by program/class. | High |
| **FR9** | **Reporting:** Generate high-density financial and balance reports. | Medium |
| **FR10** | **Student Dashboard:** Allow students to view their payment history and balance. | High |
| **FR11** | **Duplicate Detection:** Flag payments with duplicate reference numbers. | High |
| **FR12** | **OCR Verification:** Use AI to extract payment details from receipts. | Medium |
| **FR13** | **Bank Reconciliation:** Import bank statements and match with student records. | High |
| **FR14** | **Reminder Campaigns:** Automatically notify students of outstanding balances. | Medium |
| **FR15** | **Internal Messaging:** Secure messaging between students and administration. | Low |
| **FR16** | **Audit Logging:** Record all system actions performed by staff and admins. | High |

---

## 4. Non-Functional Requirements
| Category | Requirement Description | Acceptance Criteria |
| :--- | :--- | :--- |
| **Performance** | System pages should load quickly. | Pages load within 2 seconds. |
| **Security** | RBAC must be enforced on all routes. | Unauthorized users cannot access restricted data. |
| **Reliability** | Zero math errors in financial logic. | Ledger balances must be 100% accurate. |
| **Usability** | Responsive and mobile-first design. | UI remains functional on 375px mobile screens. |
| **Scalability** | Support for increasing user counts. | System handles concurrent uploads efficiently. |

---

## 5. External Interface Requirements
### 5.1 User Interfaces
The system provides a unified **Institutional Workspace** with specific screens:
*   **Auth:** Login and registration pages.
*   **Admin/Accounts:** Dashboard, Verify Payments, Reconciliation, Student Management, User Management, Fee Structure, Reports, Audit Logs, Reminder Campaigns.
*   **Student:** Student Dashboard, Payment Upload, Payment History, Messages.

### 5.2 Software Interfaces
*   **Database:** PostgreSQL (Relational storage).
*   **ORM:** Prisma (Type-safe database client).
*   **Browser:** Modern browsers with JS support.

---

## 6. Requirements Traceability Matrix (RTM)
| Requirement ID | Module / File Reference | Status |
| :--- | :--- | :--- |
| **FR1-FR2** | `auth.tsx` / `user-management.tsx` | ✅ Implemented |
| **FR3-FR5** | `verify-payments.tsx` / `student.tsx` | ✅ Implemented |
| **FR6-FR7** | `student.tsx` / Backend Ledger Logic | ✅ Implemented |
| **FR8** | `fee-structure.tsx` | ✅ Implemented |
| **FR9** | `reports.tsx` | ✅ Implemented |
| **FR11** | `verify-payments.tsx` (Duplicate Flags) | ✅ Implemented |
| **FR12** | `verify-payments.tsx` (OCR Engine) | ✅ Implemented |
| **FR13** | `reconciliation-exceptions.tsx` | ✅ Implemented |
| **FR14** | `reminder-campaigns.tsx` | ✅ Implemented |
| **FR15** | `messages.tsx` | ✅ Implemented |
| **FR16** | `audit-logs.tsx` | ✅ Implemented |
