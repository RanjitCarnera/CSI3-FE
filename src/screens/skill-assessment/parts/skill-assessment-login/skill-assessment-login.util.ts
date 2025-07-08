export const getCookieName = (accountId: string) =>
	`assessment-credentials-${accountId}`.replace(/=/g, "");
