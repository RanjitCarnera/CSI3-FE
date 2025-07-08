import { graphql } from "babel-plugin-relay/macro";

export const ASSESSMENT_FRAGMENT = graphql`
	fragment navigation_AssessmentFragment on Assessment {
		id
		supervisor {
			name
		}
		template {
			name
		}
		createdAt
		person {
			name
		}
		status {
			kind
			... on Finished {
				kind
			}
			... on PdfGenerated {
				kind
				file {
					url
					name
				}
			}
		}

		skillAssessments {
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
			skill {
				id
				name
				dimension {
					... on NumericalDimension {
						kind
						dimensionCount
					}
					... on BinaryDimension {
						kind
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
