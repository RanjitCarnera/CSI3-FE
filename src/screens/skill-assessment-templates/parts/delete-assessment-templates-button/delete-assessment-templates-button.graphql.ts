import { graphql } from "babel-plugin-relay/macro";

export const DELETE_ASSESSMENT_TEMPLATES_MUTATION = graphql`
	mutation deleteAssessmentTemplatesButton_DeleteAssessmentTemplateMutation(
		$input: DeleteAssessmentTemplateInput!
		$connections: [ID!]!
	) {
		Assessment {
			deleteAssessmentTemplate(input: $input) {
				deletedIds @deleteEdge(connections: $connections)
			}
		}
	}
`;
