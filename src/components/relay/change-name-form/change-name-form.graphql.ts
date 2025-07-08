import { graphql } from "babel-plugin-relay/macro";

export const CHANGE_NAME_MUTATION = graphql`
	mutation changeNameForm_ChangeNameMutation($input: ChangeNameInput!) {
		Auth {
			changeName(input: $input) {
				clientMutationId
			}
		}
	}
`;
