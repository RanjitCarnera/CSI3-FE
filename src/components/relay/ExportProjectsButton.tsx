import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { ExportButton } from "@components/export-button";
import { type ExportProjectsButton_ExportMutation } from "../../__generated__/ExportProjectsButton_ExportMutation.graphql";

const MUTATION = graphql`
	mutation ExportProjectsButton_ExportMutation {
		Project {
			exportProjects(input: {}) {
				file {
					url
				}
			}
		}
	}
`;

export const ExportProjectsButton = () => {
	const [doExport, isExporting] = useMutation<ExportProjectsButton_ExportMutation>(MUTATION);
	return (
		<ExportButton
			isExporting={isExporting}
			doExport={(success) => {
				doExport({
					variables: {},
					onCompleted: (response) => {
						success(response.Project.exportProjects?.file?.url!);
					},
				});
			}}
		/>
	);
};
