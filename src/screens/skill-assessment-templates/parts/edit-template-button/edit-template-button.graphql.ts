import { graphql } from "babel-plugin-relay/macro";

export const EDIT_ASSESSMENT_TEMPLATE_MUTATION = graphql`
	mutation editTemplateButton_EditAssessmentTemplateMutation(
		$input: EditAssessmentTemplateInput!
		$connections: [ID!]!
	) {
		Assessment {
			editAssessmentTemplate(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						name
						associatedRoles {
							id
						}
						assessedSkills {
							id
						}
						...skillAssessmentTemplatesTable_AssessmentTemplateFragment
					}
				}
			}
		}
	}
`;

export const ASSESSMENT_TEMPLATE_FRAGMENT = graphql`
	fragment editTemplateButton_AssessmentTemplateFragment on AssessmentTemplate {
		name
		id
		assessedSkills {
			id
			name
			skillCategory {
				id
				name
			}
		}
		associatedRoles {
			id
			name
		}
		distributionList {
			role
			emails
		}
	}
`;
