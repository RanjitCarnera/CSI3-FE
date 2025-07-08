export const SKILL_ASSESSMENT_PATH = "/skill-assessment/:accountId";
export const SKILL_ASSESSMENT_PATH_WITH_ID = (accountId: string) =>
	SKILL_ASSESSMENT_PATH.replace(":accountId", accountId);
