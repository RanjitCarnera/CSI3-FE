import { ProgressBar } from "@screens/skill-assessment-execution/parts/progress-bar";
import { useContext } from "react";
import { SkillAssessmentExecutionContext } from "@screens/skill-assessment-execution/skill-assessment-execution.context";

export const AssessmentExecutionProgressBar = () => {
	const { progress } = useContext(SkillAssessmentExecutionContext);
	return <ProgressBar value={Math.round(progress)} />;
};
