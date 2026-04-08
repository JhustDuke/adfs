export function validateFields(
	payload: Record<string, string>,
	requiredFields: string[],
	errorMessage = "missing required field:"
) {
	const cleaned: Record<string, string> = {};

	for (const key of requiredFields) {
		const value = String(payload[key] || "").trim();

		if (!value) {
			throw new Error(`${errorMessage}: "${key}" `);
		}

		cleaned[key] = value.toLowerCase();
	}

	return cleaned;
}
