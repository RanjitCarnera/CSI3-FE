import { graphql } from "babel-plugin-relay/macro";

export const EXPORT_ASSIGNMENTS_MUTATION = graphql`
	mutation exportAssignmentsButton_executeDocumentBuilderMutation(
		$input: ExecuteDocumentBuilderInput!
	) {
		DocumentBuilder {
			executeDocumentBuilder(input: $input) {
				file {
					url
				}
			}
		}
	}
`;
