import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3 } from './client.js';

const bucket = process.env.S3_BUCKET ?? 'uploads';

export const upload = multer({
  storage: multerS3({
    s3,
    bucket,
    acl: 'private',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const key = `${Date.now()}-${file.originalname}`;
      cb(null, key);
    },
  }),
  limits: {
    fileSize: 8 * 1024 * 1024, // 8 MB max per file
    files: 5,
  },
});
