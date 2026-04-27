let pdf = require('pdf-parse');
if (typeof pdf !== 'function' && pdf.default) {
  pdf = pdf.default;
}
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const extractText = async (filePath) => {
  try {
    const extension = path.extname(filePath).toLowerCase();
    console.log(`Processing file: ${filePath} with extension: ${extension}`);
    
    const dataBuffer = fs.readFileSync(filePath);

    if (extension === '.pdf') {
      console.log('Using PDF extraction');
      const data = await pdf(dataBuffer);
      return data.text;
    } else if (extension === '.docx') {
      console.log('Using DOCX extraction');
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      return result.value;
    } else if (extension === '.txt') {
      console.log('Using TXT extraction');
      return dataBuffer.toString('utf8');
    } else {
      console.log('Using fallback extraction (UTF-8)');
      return dataBuffer.toString('utf8');
    }
  } catch (error) {
    console.error(`Extraction Error for ${filePath}:`, error);
    throw error;
  }
};

module.exports = { extractText };
