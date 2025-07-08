import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { ExportButton } from "@components/export-button";
import { type ExportProjectStagesButton_ExportMutation } from "../../__generated__/ExportProjectStagesButton_ExportMutation.graphql";

const MUTATION = graphql`
	mutation ExportProjectStagesButton_ExportMutation {
		Project {
			exportProjectStages(input: {}) {
				file {
					url
				}
			}
		}
	}
`;

export const ExportProjectStagesButton = () => {
	const [doExport, isExporting] = useMutation<ExportProjectStagesButton_ExportMutation>(MUTATION);
	return (
		<ExportButton
			isExporting={isExporting}
			doExport={(success) => {
				doExport({
					variables: {},
					onCompleted: (response) => {
						success(response.Project.exportProjectStages?.file?.url!);
					},
				});
			}}
		/>
	);
};
