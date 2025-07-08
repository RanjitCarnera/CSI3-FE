import { graphql } from "babel-plugin-relay/macro";

export const PERSON_FRAGMENT = graphql`
	fragment editBinarySkillAssociationModal_PersonFragment on Person {
		id
		name
	}
`;
export const SKILL_FRAGMENT = graphql`
	fragment editBinarySkillAssociationModal_SkillFragment on Skill {
		id
		name
	}
`;

export const SKILL_ASSOCIATION_FRAGMENT = graphql`
	fragment editBinarySkillAssociationModal_SkillAssociationFragment on SkillAssociation {
		id
		data {
			value {
				... on BinaryAssessmentValue {
					kind
					hasSkill
				}
				... on NumericalAssessmentValue {
					kind
					number
				}
			}
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
		}
	}
`;

export const ASSOCIATE_SKILL_MUTATION = graphql`
	mutation editBinarySkillAssociationModal_AssociateSkillMutation($input: AssociateSkillInput!) {
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
												kind
												number
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
	mutation editBinarySkillAssociationModal_DisassociateSkillMutation(
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
												kind
												number
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
