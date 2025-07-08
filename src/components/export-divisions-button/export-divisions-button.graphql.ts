import { graphql } from "babel-plugin-relay/macro";

export const EXPORT_DIVISIONS_MUTATION = graphql`
	mutation exportDivisionsButton_ExportDivisionsMutation {
		Division {
			exportDivisions(input: {}) {
				file {
					url
				}
			}
		}
	}
`;
