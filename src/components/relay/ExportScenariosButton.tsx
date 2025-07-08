import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { ExportButton } from "@components/export-button";
import { type ExportScenariosButton_ExportMutation } from "../../__generated__/ExportScenariosButton_ExportMutation.graphql";

const MUTATION = graphql`
	mutation ExportScenariosButton_ExportMutation {
		Scenario {
			exportScenarios(input: {}) {
				file {
					url
				}
			}
		}
	}
`;

export const ExportScenariosButton = () => {
	const [doExport, isExporting] = useMutation<ExportScenariosButton_ExportMutation>(MUTATION);
	return (
		<ExportButton
			isExporting={isExporting}
			doExport={(success) => {
				doExport({
					variables: {},
					onCompleted: (response) => {
						success(response.Scenario.exportScenarios?.file?.url!);
					},
				});
			}}
		/>
	);
};
