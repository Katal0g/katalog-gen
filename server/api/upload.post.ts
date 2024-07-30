import path from "path";
import fs from "fs/promises";
import { PdfReader } from "pdfreader";
import { parsePDFReaderResponse } from "~/utils/parsing";

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);

  if (!files || files.length === 0) {
    throw new Error("No files uploaded");
  }

  const file = files[0];
  const filePath = path.join(process.cwd(), "public", file.filename as string);
  await fs.writeFile(filePath, file.data);

  return new Promise((resolve, reject) => {
    const PDFreader = new PdfReader(null);
    const textItems: string[] = [];

    PDFreader.parseFileItems(filePath, (err, item) => {
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

    // Delete the file after parsing
    fs.unlink(filePath);
  });
});
