import { graphql } from "babel-plugin-relay/macro";

export const SKILL_FRAGMENT = graphql`
	fragment editSkillButton_SkillFragment on Skill {
		id
		name
		skillCategory {
			id
		}
		description
		dimension {
			kind
			... on NumericalDimension {
				kind
				dimensionCount
				dimensionExplanations
			}
			... on BinaryDimension {
				kind
			}
		}
	}
`;

export const CREATE_MUTATION = graphql`
	mutation editSkillButton_CreateMutation($input: CreateSkillInput!, $connections: [ID!]!) {
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

export const EDIT_MUTATION = graphql`
	mutation editSkillButton_EditMutation($input: EditSkillInput!) {
		Skills {
			editSkill(input: $input) {
				edge {
					node {
						id
						...editSkillButton_SkillFragment
					}
				}
			}
		}
	}
`;
