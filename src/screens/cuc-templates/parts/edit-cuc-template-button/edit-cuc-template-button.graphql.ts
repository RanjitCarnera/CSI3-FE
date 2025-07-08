import { graphql } from "babel-plugin-relay/macro";

export const CUC_TEMPLATE_FRAGMENT = graphql`
	fragment editCucTemplateButton_CucTemplateFragment on CucTemplate {
		id
		name
		cuc {
			...EditAssignmentButton_CUCInlineFragment
		}
	}
`;

export const EDIT_CUC_TEMPLATE_MUTATION = graphql`
	mutation editCucTemplateButton_EditCucTemplateDataMutation($input: EditCucTemplateDataInput!) {
		CucTemplate {
			editCucTemplateData(input: $input) {
				cucTemplate {
					...cucTemplatesTable_CucTemplateInlineFragment
				}
			}
		}
	}
`;
export const SET_CUC_TEMPLATE_CUC_MUTATION = graphql`
	mutation editCucTemplateButton_SetCucTemplateCucMutation($input: SetCucTemplateCucInput!) {
		CucTemplate {
			setCucTemplateCuc(input: $input) {
				cucTemplate {
					...cucTemplatesTable_CucTemplateInlineFragment
				}
			}
		}
	}
`;
