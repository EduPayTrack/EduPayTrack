require('dotenv').config();

const bcrypt = require('bcryptjs');
const { PrismaClient, UserRole, PaymentMethod, PaymentStatus } = require('@prisma/client');

const prisma = new PrismaClient();

async function upsertUser({ email, password, role }) {
    const passwordHash = await bcrypt.hash(password, 10);

    return prisma.user.upsert({
        where: { email },
        update: {
            passwordHash,
            role,
        },
        create: {
            email,
            passwordHash,
            role,
        },
    });
}

async function main() {
    const admin = await upsertUser({
        email: 'admin@edupaytrack.local',
        password: 'Admin12345!',
        role: UserRole.ADMIN,
    });

    await upsertUser({
        email: 'accounts@edupaytrack.local',
        password: 'Accounts12345!',
        role: UserRole.ACCOUNTS,
    });

    const studentUser = await prisma.user.upsert({
        where: { email: 'student@edupaytrack.local' },
        update: {
            passwordHash: await bcrypt.hash('Student12345!', 10),
            role: UserRole.STUDENT,
        },
        create: {
            email: 'student@edupaytrack.local',
            passwordHash: await bcrypt.hash('Student12345!', 10),
            role: UserRole.STUDENT,
            student: {
                create: {
                    studentCode: 'EDU-001',
                    firstName: 'Demo',
                    lastName: 'Student',
                    program: 'Computer Science',
                    classLevel: 'Year 4',
                    academicYear: '2026',
                    phone: '+265990000001',
                },
            },
        },
        include: {
            student: true,
        },
    });

    const feeStructure = await prisma.feeStructure.upsert({
        where: { id: 'demo-fee-structure' },
        update: {
            title: 'Computer Science Semester Fee',
            amount: 450000,
            program: 'Computer Science',
            academicYear: '2026',
            active: true,
        },
        create: {
            id: 'demo-fee-structure',
            title: 'Computer Science Semester Fee',
            description: 'Demo semester fee structure for seeded environments.',
            amount: 450000,
            program: 'Computer Science',
            academicYear: '2026',
            active: true,
        },
    });

    if (studentUser.student) {
        await prisma.payment.upsert({
            where: { id: 'demo-payment-approved' },
            update: {},
            create: {
                id: 'demo-payment-approved',
                studentId: studentUser.student.id,
                amount: 150000,
                currency: 'MWK',
                method: PaymentMethod.BANK,
                externalReference: 'DEMO-BANK-001',
                receiptNumber: 'RCPT-001',
                proofUrl: 'http://localhost:5000/uploads/demo-proof-1.pdf',
                payerName: 'Demo Guardian',
                paymentDate: new Date('2026-03-01'),
                status: PaymentStatus.APPROVED,
                reviewerId: admin.id,
                reviewedAt: new Date('2026-03-02'),
                notes: 'Initial installment',
            },
        });

        await prisma.payment.upsert({
            where: { id: 'demo-payment-pending' },
            update: {},
            create: {
                id: 'demo-payment-pending',
                studentId: studentUser.student.id,
                amount: 100000,
                currency: 'MWK',
                method: PaymentMethod.MOBILE_MONEY,
                externalReference: 'DEMO-MM-002',
                receiptNumber: 'RCPT-002',
                proofUrl: 'http://localhost:5000/uploads/demo-proof-2.jpg',
                payerName: 'Demo Guardian',
                paymentDate: new Date('2026-03-10'),
                status: PaymentStatus.PENDING,
                notes: 'Second installment awaiting review',
                duplicateFlag: false,
            },
        });

        await prisma.student.update({
            where: { id: studentUser.student.id },
            data: {
                currentBalance: Number(feeStructure.amount) - 150000,
            },
        });
    }

    console.log('Demo seed complete.');
    console.log('Admin: admin@edupaytrack.local / Admin12345!');
    console.log('Accounts: accounts@edupaytrack.local / Accounts12345!');
    console.log('Student: student@edupaytrack.local / Student12345!');
}

main()
    .catch((error) => {
        console.error('Failed to seed demo data.');
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
