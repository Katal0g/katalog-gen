import { PdfReader } from "pdfreader";
import { parsePDFReaderResponse } from "~/utils/parsing";

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);

  if (!files || files.length === 0) {
    throw new Error("No files uploaded");
  }

  const file = files[0];
  return new Promise((resolve, reject) => {
    const PDFreader = new PdfReader(null);
    const textItems: string[] = [];

    PDFreader.parseBuffer(file.data, (err, item) => {
      if (err) {
        console.error("Error:", err);
        reject(err);
      } else if (!item) {
        // End of file
        console.warn("End of file");
        const rawText = textItems.join("");
        const parsedText = parsePDFReaderResponse(rawText);
        resolve(parsedText);
      } else if (item.text) {
        textItems.push(item.text);
      }
    });
  });
});
