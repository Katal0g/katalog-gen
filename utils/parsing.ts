export const parsePDFReaderResponse = (rawText: string): string => {
  // Split the raw text into lines for easier processing
  const lines = rawText.split("\n");

  // Initialize an array to hold the cleaned lines
  let cleanedLines: string[] = [];

  // Process each line
  for (let line of lines) {
    // Trim leading and trailing whitespace
    line = line.trim();

    // Skip empty lines
    if (line.length === 0) continue;

    line = line.replace(/\s{2,}/g, " "); // Replace multiple spaces with a single space

    // Add the cleaned line to the array
    cleanedLines.push(line);
  }

  // Join the cleaned lines into a single string
  const cleanedText = cleanedLines.join("\n");

  // Further processing to organize the text into meaningful sections
  const sections = cleanedText.split("\n\n"); // Split into sections based on double newline
  const formattedSections = sections
    .map((section) => section.trim())
    .filter((section) => section.length > 0);

  // Join the formatted sections with double newlines to maintain separation
  return formattedSections.join("\n\n");
};
