import React from "react";
import { ValidatedFieldConfig } from "@components/ui/ValidatedField";
import { useLazyLoadQuery } from "react-relay";
import { ASSESSMENT_TEMPLATES_QUERY } from "@components/relay/select-skill-assessment-templates/select-skill-assessment-templates.graphql";
import { selectSkillAssessmentTemplates_AssessmentTemplatesQuery } from "@relay/selectSkillAssessmentTemplates_AssessmentTemplatesQuery.graphql";
import { Dropdown } from "primereact/dropdown";

export const SelectSkillAssessmentTemplates = ({
	fieldValue,
	fieldName,
	updateField,
	accountId,
	...props
}: ValidatedFieldConfig<string> & { accountId: string }) => {
	const {
		Assessment: {
			AssessmentTemplates: { edges: assessmentTemplateEdges },
		},
	} = useLazyLoadQuery<selectSkillAssessmentTemplates_AssessmentTemplatesQuery>(
		ASSESSMENT_TEMPLATES_QUERY,
		{ accountId },
	);
	const assessmentTemplates = assessmentTemplateEdges
		?.map((e) => e?.node!)
		.map((e) => ({ label: e.name, value: e.id, name: e.name }));
	return (
		<Dropdown
			name={fieldName}
			value={fieldValue}
			options={assessmentTemplates}
			onChange={(e) => updateField(e.value)}
			filter={true}
			filterBy={"name"}
			{...props}
		/>
	);
};
