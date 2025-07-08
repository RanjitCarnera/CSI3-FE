import { Role } from "@relay/createTemplateButton_CreateAssessmentTemplateMutation.graphql";

export type RoleOption = {
	value: Role;
	label: string;
};

export type CreateTemplateFormState = {
	name?: string;
	jobTitles?: string[];
	skills: string[];
	distributionListRole: Role[];
	distributionListEmails: string[];
};
