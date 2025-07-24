import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { saveCV } from './HigherEducationFile';

const TEMPLATE_DIR = path.join(__dirname, '../../cv-templates');

export const generateStudentCV = async (templateId: string, data: object, userId: string) => {
  // 1. Read template file
  const templatePath = path.join(TEMPLATE_DIR, `${templateId}.hbs`);
  const html = fs.readFileSync(templatePath, 'utf8');
  
  // 2. Compile with Handlebars
  const compiled = handlebars.compile(html);
  const finalHTML = compiled(data);
  
  // 3. Generate PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(finalHTML);
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();
  
  // 4. Save to storage
//   return saveCV(pdf, userId);
};