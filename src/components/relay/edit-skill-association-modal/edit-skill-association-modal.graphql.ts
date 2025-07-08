import { graphql } from "babel-plugin-relay/macro";

export const SKILL_FRAGMENT = graphql`
	fragment editSkillAssociationModal_SkillFragment on Skill {
		name
		dimension {
			kind
			... on NumericalDimension {
				kind
			}
			... on SkillDimensionInterface {
				kind
			}
		}
		...editBinarySkillAssociationModal_SkillFragment
		...editNumericalSkillAssociationModal_SkillFragment
	}
`;
export const SKILL_ASSOCIATION_FRAGMENT = graphql`
	fragment editSkillAssociationModal_SkillAssociationFragment on SkillAssociation {
		id
		data {
			value {
				... on NumericalAssessmentValue {
					kind
					number
				}
				... on BinaryAssessmentValue {
					kind
					hasSkill
				}
			}
			skill {
				name
				skillCategory {
					name
				}
				dimension {
					... on BinaryDimension {
						kind
					}
					... on NumericalDimension {
						dimensionCount
						kind
					}
				}
			}
		}

		...editNumericalSkillAssociationModal_SkillAssociationFragment
		...editBinarySkillAssociationModal_SkillAssociationFragment
	}
`;

export const PERSON_FRAGMENT = graphql`
	fragment editSkillAssociationModal_PersonFragment on Person {
		name
		id
		...editNumericalSkillAssociationModal_PersonFragment
		...editBinarySkillAssociationModal_PersonFragment
	}
`;
