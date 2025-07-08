export const SKILL_ASSESSMENT_SUCCESS_PATH = "/skill-assessment/:accountId/:id/success";
export const SKILL_ASSESSMENT_SUCCESS_PATH_WITH_ID = (accountId: string, assessmentId: string) =>
	SKILL_ASSESSMENT_SUCCESS_PATH.replace(":accountId", accountId).replace(":id", assessmentId);
