import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query skillAssessmentsTable_Query($first: Int, $after: String) {
		Viewer {
			Auth {
				currentAccount {
					id
				}
			}
		}
		...skillAssessmentsTable_AssessmentsFragment @arguments(first: $first, after: $after)
	}
`;

export const QUERY_FRAGMENT = graphql`
	fragment skillAssessmentsTable_AssessmentsFragment on Query
	@refetchable(queryName: "skillAssessmentsTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 250 }
		last: { type: "Int" }
		after: { type: "String" }
		before: { type: "String" }
		filterByName: { type: "String" }
	) {
		Admin {
			Assessment {
				Assessments(
					last: $last
					before: $before
					after: $after
					first: $first
					filterByName: $filterByName
				) @connection(key: "skillAssessmentsTable_Assessments") {
					__id
					pageInfo {
						endCursor
						hasPreviousPage
						hasNextPage
						startCursor
					}
					edges {
						node {
							...skillAssessmentsTable_AssessmentInlineFragment
						}
					}
				}
			}
		}
	}
`;

export const ASSESSMENT_FRAGMENT = graphql`
	fragment skillAssessmentsTable_AssessmentInlineFragment on Assessment @inline {
		id
		person {
			name
			id
		}
		supervisor {
			name
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
			... on PdfGenerated {
				kind
				finishedAt
				file {
					id
					name
					url
				}
			}
		}
		skillAssessments {
			skill {
				id
				dimension {
					kind
				}
				name
				skillCategory {
					id
					name
				}
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
		template {
			id
			name
			assessedSkills {
				id
			}
			associatedRoles {
				id
			}
		}
		createdAt
		...revertToAssessmentButton_AssessmentFragment
	}
`;

export const FINALIZE_TEST_MUTATION = graphql`
	mutation skillAssessmentsTable_TestAssessmentFinalizationMutation(
		$input: TestAssessmentFinalizationInput!
	) {
		Admin {
			Assessment {
				testAssessmentFinalization(input: $input) {
					assessment {
						id
						status {
							... on PdfGenerated {
								file {
									url
								}
							}
						}
					}
				}
			}
		}
	}
`;
