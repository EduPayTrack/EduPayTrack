require('dotenv').config();

const bcrypt = require('bcryptjs');
const { PrismaClient, UserRole } = require('@prisma/client');

const prisma = new PrismaClient();

function readArg(flag) {
    const index = process.argv.indexOf(flag);
    return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
    const email =
        readArg('--email') ||
        process.env.ADMIN_EMAIL ||
        'admin@edupaytrack.local';
    const password =
        readArg('--password') ||
        process.env.ADMIN_PASSWORD ||
        'Admin12345!';
    const firstName =
        readArg('--firstName') ||
        process.env.ADMIN_FIRST_NAME ||
        'Admin';
    const lastName =
        readArg('--lastName') ||
        process.env.ADMIN_LAST_NAME ||
        'User';
    const roleInput =
        readArg('--role') ||
        process.env.ADMIN_ROLE ||
        UserRole.ADMIN;

    const role = Object.values(UserRole).includes(roleInput)
        ? roleInput
        : UserRole.ADMIN;

    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log(`User already exists: ${email} (${existingUser.role})`);
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            firstName,
            lastName,
            role,
        },
    });

    console.log('Admin bootstrap complete.');
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.firstName} ${user.lastName}`);
    console.log(`Role: ${user.role}`);
    console.log('You can now sign in from /login or open /admin directly.');
}

main()
    .catch((error) => {
        console.error('Failed to bootstrap admin user.');
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
