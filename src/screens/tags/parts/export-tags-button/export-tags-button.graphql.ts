import { graphql } from "babel-plugin-relay/macro";

export const EXPORT_TAGS_MUTATION = graphql`
	mutation exportTagsButton_executeDocumentBuilderMutation($input: ExecuteDocumentBuilderInput!) {
		DocumentBuilder {
			executeDocumentBuilder(input: $input) {
				file {
					url
				}
			}
		}
	}
`;
