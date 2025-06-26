/**
 * Calculates the estimated reading time for content
 * @param content - The main content text
 * @param steps - Array of workflow steps (can be strings or objects)
 * @param wordsPerMinute - Reading speed (default: 200 words per minute)
 * @returns Estimated reading time in minutes (minimum 1 minute)
 */
export default function calculateReadingTime(
  content?: string | null,
  steps?: (string | object)[] | null,
  wordsPerMinute: number = 200
): number {
  // Calculate words in main content
  const wordsContentLength = content?.split(/\s+/).length || 0;
  
  // Calculate words in steps
  const wordStepsLength = steps
    ? steps.reduce((total, step) => {
        return (
          total + (typeof step === "string" ? step.split(/\s+/).length : 0)
        );
      }, 0)
    : 0;
  
  // Calculate total words and reading time
  const wordsTotal = wordsContentLength + wordStepsLength;
  const readingTime = Math.max(1, Math.ceil(wordsTotal / wordsPerMinute));
  
  return readingTime;
}