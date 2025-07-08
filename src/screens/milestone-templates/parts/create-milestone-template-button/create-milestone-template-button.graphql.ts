import { graphql } from "babel-plugin-relay/macro";

export const CREATE_MILESTONE_TEMPLATE_MUTATION = graphql`
	mutation createMilestoneTemplateButton_CreateMilestoneTemplateMutation(
		$input: CreateMilestoneTemplateInput!
		$connections: [ID!]!
	) {
		MilestoneTemplate {
			createMilestoneTemplate(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						...milestoneTemplatesTable_MilestoneTemplateInlineFragment
					}
				}
			}
		}
	}
`;
