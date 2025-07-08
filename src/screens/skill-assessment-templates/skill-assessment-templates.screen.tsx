import React from "react";
import { SkillAssessmentTemplatesFilters } from "@screens/skill-assessment-templates/parts/skill-assessment-templates-filters";
import { SkillAssessmentTemplatesTable } from "@screens/skill-assessment-templates/parts/skill-assessment-templates-table";
import { CreateTemplateFormContextProvider } from "@screens/skill-assessment-templates/parts/create-template-form/create-template-form.context";
import { SettingsScreenTemplate } from "@components/settings-screen-template/settings-screen-template.component";

export const SkillAssessmentTemplates = () => {
	return (
		<SettingsScreenTemplate
			title={"Assessment Templates"}
			Filters={SkillAssessmentTemplatesFilters}
			Table={SkillAssessmentTemplatesTable}
			ContextProvider={CreateTemplateFormContextProvider}
		/>
	);
};
