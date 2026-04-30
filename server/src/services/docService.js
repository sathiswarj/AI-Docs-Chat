let pdfParse = require('pdf-parse');
if (typeof pdfParse !== 'function' && pdfParse.default) {
  pdfParse = pdfParse.default;
}
const PDFParser = require('pdf-parser');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const extractText = async (filePath) => {
  try {
    const extension = path.extname(filePath).toLowerCase();
    console.log(`Processing file: ${filePath} with extension: ${extension}`);
    
    const dataBuffer = fs.readFileSync(filePath);

    if (extension === '.pdf') {
      console.log('Using Primary PDF extraction (pdf-parse)');
      try {
        const data = await pdfParse(dataBuffer);
        return data.text;
      } catch (parseError) {
        console.warn('Primary PDF extraction failed, trying fallback...', parseError.message);
        
        // Fallback using pdf-parser
        return new Promise((resolve, reject) => {
          PDFParser.pdf2json(filePath, (err, data) => {
            if (err) {
              console.error('Fallback PDF extraction also failed:', err);
              reject(new Error('The PDF file is corrupted or its format is not supported (bad XRef entry).'));
            } else {
              try {
                // Extract text from pages in pdf-parser's JSON format
                const text = data.pages
                  .map(page => {
                    return page.texts
                      .map(t => t.text)
                      .join(' ');
                  })
                  .join('\n\n');
                resolve(text);
              } catch (extractError) {
                console.error('Error extracting text from fallback JSON:', extractError);
                reject(new Error('Failed to extract text from the document.'));
              }
            }
          });
        });
      }
    } else if (extension === '.docx') {
// ... existing code ...      console.log('Using DOCX extraction');
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
