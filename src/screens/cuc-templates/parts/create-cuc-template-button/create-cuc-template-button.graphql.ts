import { graphql } from "babel-plugin-relay/macro";

export const CREATE_CUC_TEMPLATE_MUTATION = graphql`
	mutation createCucTemplateButton_CreateCucTemplateMutation(
		$input: CreateCucTemplateInput!
		$connections: [ID!]!
	) {
		CucTemplate {
			createCucTemplate(input: $input) {
				cucTemplateEdge @appendEdge(connections: $connections) {
					node {
						...cucTemplatesTable_CucTemplateInlineFragment
					}
				}
			}
		}
	}
`;
