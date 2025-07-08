/**
 * Sanitizes an HTML ID by replacing invalid characters with underscores.
 *
 * @param inputId - The input string to be sanitized.
 * @returns A sanitized version of the input ID with invalid characters replaced by underscores.
 * @example
 * ```typescript
 * const inputId = "my_invalid-id@123";
 * const sanitizedId = sanitizeHtmlId(inputId);
 * console.log(sanitizedId); // Output: "my_invalid-id_123"
 * ```
 */
export const sanitizeHtmlId = (inputId: string): string => {
	const validIdPattern = /[^a-zA-Z0-9\-_:.]/g;
	const sanitizedId = inputId.replace(validIdPattern, "_");
	return sanitizedId;
};
