import React from "react";
import { SkillAssessmentsTable } from "@screens/skill-assessments/parts/skill-assessments-table";
import { SkillAssessmentsFilters } from "@screens/skill-assessments/parts/skill-assessments-filters";
import { SettingsScreenTemplate } from "@components/settings-screen-template/settings-screen-template.component";

export const SkillAssessments = () => {
	return (
		<SettingsScreenTemplate
			title={"Assessments"}
			Filters={SkillAssessmentsFilters}
			Table={SkillAssessmentsTable}
		/>
	);
};
