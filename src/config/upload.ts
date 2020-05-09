import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
export const uploadsFolder = path.resolve(tmpFolder, 'uploads');

export default {
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
