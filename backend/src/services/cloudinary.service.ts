import fs from 'fs';
import path from 'path';

import { env } from '../config/env';
import { AppError } from '../middleware/error-handler';

const cloudinaryConfigured = Boolean(
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET
);

const toSignatureBase = (params: Record<string, string>) =>
    Object.entries(params)
        .filter(([, value]) => value !== '')
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

const sha1Hex = async (value: string) => {
    const crypto = await import('crypto');
    return crypto.createHash('sha1').update(value).digest('hex');
};

export const isCloudinaryEnabled = () => cloudinaryConfigured;

export const uploadReceiptToCloudinary = async (filePath: string, originalName: string, mimeType?: string) => {
    if (!cloudinaryConfigured) {
        throw new AppError('Cloudinary is not configured', 503, 'CLOUDINARY_UNAVAILABLE');
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = 'edupaytrack/receipts';
    const publicId = path.basename(originalName, path.extname(originalName))
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .toLowerCase();

    const paramsToSign = {
        folder,
        public_id: publicId,
        timestamp,
    };

    const signature = await sha1Hex(
        `${toSignatureBase(paramsToSign)}${env.CLOUDINARY_API_SECRET}`
    );

    const fileBuffer = await fs.promises.readFile(filePath);
    const fileBlob = new Blob([fileBuffer], {
        type: mimeType || 'application/octet-stream',
    });
    const formData = new FormData();
    formData.append('file', fileBlob, path.basename(filePath));
    formData.append('api_key', env.CLOUDINARY_API_KEY!);
    formData.append('timestamp', timestamp);
    formData.append('folder', folder);
    formData.append('public_id', publicId);
    formData.append('signature', signature);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
            method: 'POST',
            body: formData,
        }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.secure_url) {
        throw new AppError('Cloudinary upload failed', 502, 'CLOUDINARY_UPLOAD_FAILED', {
            status: response.status,
            payload,
        });
    }

    return {
        secureUrl: payload.secure_url as string,
        publicId: payload.public_id as string,
        resourceType: payload.resource_type as string | undefined,
    };
};
