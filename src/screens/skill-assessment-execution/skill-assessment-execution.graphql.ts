import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query skillAssessmentExecution_Query($accountId: ID!, $assessmentId: ID!, $password: String) {
		Assessment {
			MyAssessment(accountId: $accountId, assessmentId: $assessmentId, password: $password) {
				person {
					id
					name
				}
				supervisor {
					id
					name
				}
				template {
					id
					name
					assessedSkills {
						id
						name
						skillCategory {
							id
							name
							sortOrder
							...categoryForm_SkillCategoryFragment
						}
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
					...categoryForm_AssessmentTemplateFragment
				}
				skillAssessments {
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
				}
				status {
					kind
					... on InProgress {
						kind
						lastUpdate
					}
					... on Finished {
						kind
						finishedAt
					}
				}
				...categoryForm_AssessmentFragment
				...navigation_AssessmentFragment
				...skillAssessmentExecution_AssessmentFragment
			}
		}
	}
`;

export const ANSWER_ASSESSMENT_MUTATION = graphql`
	mutation skillAssessmentExecution_AnswerAssessmentMutation($input: AnswerAssessmentInput!) {
		Assessment {
			answerAssessment(input: $input) {
				assessment {
					id
					...skillAssessmentExecution_AssessmentFragment
				}
			}
		}
	}
`;
export const SUBMIT_ASSESSMENT_MUTATION = graphql`
	mutation skillAssessmentExecution_SubmitAssessmentMutation($input: SubmitAssessmentInput!) {
		Assessment {
			submitAssessment(input: $input) {
				assessment {
					id
					...skillAssessmentExecution_AssessmentFragment
				}
			}
		}
	}
`;

export const ASSESSMENT_FRAGMENT = graphql`
	fragment skillAssessmentExecution_AssessmentFragment on Assessment {
		id
		status {
			kind
			... on InProgress {
				kind
			}
			... on PdfGenerated {
				kind
			}
			... on Finished {
				kind
			}
		}
		template {
			assessedSkills {
				id
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
		skillAssessments {
			skill {
				id
			}
			value {
				kind
				... on BinaryAssessmentValue {
					kind
					hasSkill
				}
				... on NumericalAssessmentValue {
					kind
					number
				}
			}
		}
		status {
			kind
			... on InProgress {
				kind
			}
			... on PdfGenerated {
				kind
			}
		}
	}
`;
