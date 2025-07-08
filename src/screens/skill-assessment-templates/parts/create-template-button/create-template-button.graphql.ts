import { graphql } from "babel-plugin-relay/macro";

export const CREATE_ASSESSMENT_TEMPLATE_MUTATION = graphql`
	mutation createTemplateButton_CreateAssessmentTemplateMutation(
		$input: CreateAssessmentTemplateInput!
		$connections: [ID!]!
	) {
		Assessment {
			createAssessmentTemplate(input: $input) {
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
