import { graphql } from "babel-plugin-relay/macro";

export const DELETE_CUC_TEMPLATES_MUTATION = graphql`
	mutation deleteCucTemplatesButton_DeleteCucTemplatesMutation(
		$input: DeleteCucTemplateInput!
		$connections: [ID!]!
	) {
		CucTemplate {
			deleteCucTemplate(input: $input) {
				deletedIds @deleteEdge(connections: $connections)
			}
		}
	}
`;
