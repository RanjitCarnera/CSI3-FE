import { graphql } from "babel-plugin-relay/macro";

export const ASSESSMENT_FRAGMENT = graphql`
	fragment revertToAssessmentForm_AssessmentFragment on Assessment {
		id
		status {
			... on PdfGenerated {
				finishedAt
			}
		}
		template {
			name
		}
		skillAssessments {
			skill {
				name
			}
			value {
				kind
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
		person {
			id
			name
		}
	}
`;
