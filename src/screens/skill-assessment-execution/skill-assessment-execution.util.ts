import { type FormikProps } from "formik/dist/types";
import { type SkillAssessmentExecutionFormState } from "./skill-assessment-execution.types";

export const useAssessmentExecutionProgress = (
	formik: FormikProps<SkillAssessmentExecutionFormState>,
) => {
	const formValues = Object.values(formik.values);
	const formValuesAmount = formValues.length;
	const answeredEntries = Object.values(formik.values).filter((e) => {
		if (e.kind === "numerical") {
			return typeof e.number === "number";
		} else if (e.kind === "binary") {
			return typeof e.hasSkill === "boolean";
		}
		return false;
	});
	const answeredEntriesAmount = answeredEntries.length;
	const progress =
		answeredEntriesAmount === 0 ? 0 : (answeredEntriesAmount / formValuesAmount) * 100;
	return progress;
};
