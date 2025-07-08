import { graphql } from "babel-plugin-relay/macro";

export const DELETE_DIVISION_MUTATION = graphql`
	mutation deleteDivisionButton_DeleteDivisionMutation(
		$input: DeleteDivisionInput!
		$connections: [ID!]!
	) {
		Division {
			deleteDivision(input: $input) {
				deletedIds @deleteEdge(connections: $connections)
			}
		}
	}
`;
