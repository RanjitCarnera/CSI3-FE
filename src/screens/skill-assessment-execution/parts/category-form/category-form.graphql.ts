import { graphql } from "babel-plugin-relay/macro";

export const ASSESSMENT_TEMPLATE_FRAGMENT = graphql`
	fragment categoryForm_AssessmentTemplateFragment on AssessmentTemplate {
		assessedSkills {
			skillCategory {
				name
				id
				sortOrder
			}
		}
	}
`;
export const SKILL_CATEGORY_FRAGMENT = graphql`
	fragment categoryForm_SkillCategoryFragment on SkillCategory {
		name
		id
		sortOrder
	}
`;
export const SKILL_FRAGMENT = graphql`
	fragment categoryForm_SkillFragment on Skill @inline {
		name
		id
		description
		skillCategory {
			name
			id
		}
		dimension {
			... on NumericalDimension {
				kind
				dimensionExplanations
				dimensionCount
			}
			... on BinaryDimension {
				kind
			}
		}
	}
`;
export const ASSESSMENT_FRAGMENT = graphql`
	fragment categoryForm_AssessmentFragment on Assessment {
		skillAssessments {
			value {
				kind
				... on BinaryAssessmentValue {
					hasSkill
					kind
				}
				... on NumericalAssessmentValue {
					number
					kind
				}
			}
		}
		template {
			assessedSkills {
				id
				name
				dimension {
					... on BinaryDimension {
						kind
					}
					... on NumericalDimension {
						kind
						dimensionCount
						dimensionExplanations
					}
				}
				description
				skillCategory {
					id
					name
					sortOrder
				}
				...numericalSkillTooltipIcon_SkillFragment
			}
			name
		}
	}
`;
