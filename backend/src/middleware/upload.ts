import multer from 'multer';
import path from 'path';

import { ensureUploadsDirectory, uploadsDirectory } from '../config/storage';
import { AppError } from './error-handler';

ensureUploadsDirectory();

const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.pdf']);
const allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'application/pdf',
]);

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.ico']);
const imageMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
    'image/vnd.microsoft.icon',
]);

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, uploadsDirectory);
    },
    filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const safeBaseName = path
            .basename(file.originalname, extension)
            .replace(/[^a-zA-Z0-9-_]/g, '-')
            .toLowerCase();

        callback(null, `${Date.now()}-${safeBaseName}${extension}`);
    },
});

export const uploadReceipt = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const validFile =
            allowedExtensions.has(extension) && allowedMimeTypes.has(file.mimetype);

        if (!validFile) {
            callback(new AppError('Only JPG, PNG, and PDF receipt files are allowed', 400));
            return;
        }

        callback(null, true);
    },
});

export const uploadProfilePicture = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const validFile =
            imageExtensions.has(extension) && imageMimeTypes.has(file.mimetype);

        if (!validFile) {
            callback(new AppError('Only image files are allowed (JPG, PNG, GIF, WebP, SVG, BMP, TIFF)', 400));
            return;
        }

        callback(null, true);
    },
});
