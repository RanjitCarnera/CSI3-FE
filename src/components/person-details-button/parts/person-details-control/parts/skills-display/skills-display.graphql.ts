import { graphql } from "babel-plugin-relay/macro";

export const PERSON_FRAGMENT = graphql`
	fragment skillsDisplay_PersonFragment on Person {
		id
		skills(first: 100) {
			edges {
				node {
					...skillsDisplay_SkillAssociationInlineFragment
				}
			}
		}
	}
`;
export const SKILL_ASSOCIATION_INLINE_FRAGMENT = graphql`
	fragment skillsDisplay_SkillAssociationInlineFragment on SkillAssociation @inline {
		id
		data {
			value {
				... on NumericalAssessmentValue {
					kind
					number
				}
				... on BinaryAssessmentValue {
					hasSkill
					kind
				}
			}
			expirationDate

			skill {
				id
				name
				dimension {
					kind
					... on NumericalDimension {
						kind
						dimensionCount
					}
				}
				skillCategory {
					id
					name
				}
			}
		}
	}
`;
