import fs from 'fs';
import path from 'path';

export const uploadsDirectory = path.resolve(process.cwd(), 'uploads');

export const ensureUploadsDirectory = () => {
    if (!fs.existsSync(uploadsDirectory)) {
        fs.mkdirSync(uploadsDirectory, { recursive: true });
    }
};
