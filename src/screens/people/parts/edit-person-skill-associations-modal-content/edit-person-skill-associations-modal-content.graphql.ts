import { graphql } from "babel-plugin-relay/macro";

export const PERSON_FRAGMENT = graphql`
	fragment editPersonSkillAssociationsModalContent_PersonFragment on Person {
		id
		name
		skills(first: 100) @connection(key: "Person_skills") {
			__id
			edges {
				node {
					id
					data {
						expirationDate
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
						skill {
							id
							name
							dimension {
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
					}
					...editSkillAssociationModal_SkillAssociationFragment
				}
			}
		}
		...editSkillAssociationModal_PersonFragment
	}
`;

export const SKILLS_QUERY = graphql`
	query editPersonSkillAssociationsModalContent_SkillsQuery {
		Skills {
			Skills(first: 200) {
				edges {
					node {
						...editPersonSkillAssociationsModalContent_SkillInlineFragment
					}
				}
			}
		}
	}
`;
export const SKILL_INLINE_FRAGMENT = graphql`
	fragment editPersonSkillAssociationsModalContent_SkillInlineFragment on Skill @inline {
		id
		name
		description
		skillCategory {
			id
			name
		}
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
		...editSkillAssociationModal_SkillFragment
		...numericalSkillTooltipIcon_SkillFragment
	}
`;

export const DISASSOCIATE_SKILLS_BY_CATEGORY_MUTATION = graphql`
	mutation editPersonSkillAssociationsModalContent_DisassociateSkillsByCategoryMutation(
		$input: DisassociateSkillsByCategoryInput!
		$connections: [ID!]!
	) {
		Skills {
			disassociateSkillsByCategory(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						id
						name
						assignmentRole {
							name
						}
						skills(first: 100) @connection(key: "Person_skills") {
							edges {
								node {
									id
									data {
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
										skill {
											name
											dimension {
												kind
												... on BinaryDimension {
													kind
												}
												... on NumericalDimension {
													kind
													dimensionExplanations
													dimensionCount
												}
											}
										}
									}
								}
							}
						}
						...EditPersonButton_PersonFragment
						...editPersonSkillAssociationsButton_PersonFragment
					}
				}
			}
		}
	}
`;

export const SET_SKILL_ASSOCIATION_EXPIRATION_DATE_MUTATION = graphql`
	mutation editPersonSkillAssociationsModalContent_SetSkillAssociationExpirationDateInputMutation(
		$input: SetSkillAssociationExpirationDateInput!
	) {
		Skills {
			setSkillAssociationExpirationDate(input: $input) {
				skillAssociation {
					...skillsDisplay_SkillAssociationInlineFragment
				}
			}
		}
	}
`;
