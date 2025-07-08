export const SKILL_ASSESSMENT_EXECUTION_PATH = "/skill-assessment/:accountId/:id";
export const SKILL_ASSESSMENT_EXECUTION_PATH_WITH_ID = (accountId: string, assessmentId: string) =>
	SKILL_ASSESSMENT_EXECUTION_PATH.replace(":accountId", accountId).replace(":id", assessmentId);
