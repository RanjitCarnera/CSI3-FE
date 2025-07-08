import { graphql } from "babel-plugin-relay/macro";

export const CREATE_MUTATION = graphql`
	mutation createSkillButton_CreateMutation($input: CreateSkillInput!, $connections: [ID!]!) {
		Skills {
			createSkill(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						id
						...editSkillButton_SkillFragment
					}
				}
			}
		}
	}
`;
