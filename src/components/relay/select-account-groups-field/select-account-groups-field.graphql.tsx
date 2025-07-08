import { graphql } from "babel-plugin-relay/macro";

export const SELECT_ACCOUNT_GROUPS_FIELD_QUERY = graphql`
	query selectAccountGroupsField_Query {
		Admin {
			Management {
				AccountGroups(first: 50) {
					edges {
						node {
							id
							name
						}
					}
				}
			}
		}
	}
`;
