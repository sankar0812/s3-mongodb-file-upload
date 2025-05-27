import { Request } from 'express';
import { extname } from 'path';

// Filter function to allow only images
export const imageFileFilter = (req: Request, file: Express.Multer.File, callback) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

// Rename uploaded file
export const fileNameEditor = (req: Request, file: Express.Multer.File, callback) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = extname(file.originalname);
  callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
};
