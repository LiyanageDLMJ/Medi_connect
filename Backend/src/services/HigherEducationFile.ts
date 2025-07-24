// Backend/src/services/fileService.ts
import fs from 'fs';
import path from 'path';

const CV_FOLDER = path.join(__dirname, '../../uploads/cvs');

export const saveCV = (pdfBuffer: Buffer, userId: string) => {
  const filename = `cv-${Date.now()}-${userId}.pdf`;
  const filePath = path.join(CV_FOLDER, filename);
  
  if (!fs.existsSync(CV_FOLDER)) {
    fs.mkdirSync(CV_FOLDER, { recursive: true });
  }
  
  fs.writeFileSync(filePath, pdfBuffer);
  return `/uploads/cvs/${filename}`; // Return accessible URL
};