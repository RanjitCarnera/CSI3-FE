import { graphql } from "babel-plugin-relay/macro";

export const SKILL_FRAGMENT = graphql`
	fragment editNumericalSkillAssociationModal_SkillFragment on Skill {
		id
		name
	}
`;
export const PERSON_FRAGMENT = graphql`
	fragment editNumericalSkillAssociationModal_PersonFragment on Person {
		id
		name
	}
`;

export const SKILL_ASSOCIATION_FRAGMENT = graphql`
	fragment editNumericalSkillAssociationModal_SkillAssociationFragment on SkillAssociation {
		id
		data {
			skill {
				id
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
			value {
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
	}
`;

export const ASSOCIATE_SKILL_MUTATION = graphql`
	mutation editNumericalSkillAssociationModal_AssociateSkillMutation(
		$input: AssociateSkillInput!
	) {
		Skills {
			associateSkill(input: $input) {
				edge {
					node {
						skills(first: 100) {
							edges {
								node {
									data {
										skill {
											id
											name
											dimension {
												kind
												... on BinaryDimension {
													kind
												}
												... on NumericalDimension {
													kind
												}
											}
										}
										value {
											... on NumericalAssessmentValue {
												number
												kind
											}
											... on BinaryAssessmentValue {
												hasSkill
												kind
											}
										}
									}
									...editSkillAssociationModal_SkillAssociationFragment
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
export const DISASSOCIATE_SKILL_MUTATION = graphql`
	mutation editNumericalSkillAssociationModal_DisassociateSkillMutation(
		$input: DisassociateSkillInput!
	) {
		Skills {
			disassociateSkill(input: $input) {
				edge {
					node {
						skills(first: 100) {
							edges {
								node {
									data {
										skill {
											id
											name
											dimension {
												kind
												... on BinaryDimension {
													kind
												}
												... on NumericalDimension {
													kind
												}
											}
										}
										value {
											... on NumericalAssessmentValue {
												number
												kind
											}
											... on BinaryAssessmentValue {
												hasSkill
												kind
											}
										}
									}
									...editSkillAssociationModal_SkillAssociationFragment
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
