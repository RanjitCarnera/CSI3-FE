import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { ExportButton } from "@components/export-button";
import { type ExportRegionsButton_ExportMutation } from "../../__generated__/ExportRegionsButton_ExportMutation.graphql";

const MUTATION = graphql`
	mutation ExportRegionsButton_ExportMutation {
		Region {
			exportRegions(input: {}) {
				file {
					url
				}
			}
		}
	}
`;

export const ExportRegionsButton = () => {
	const [doExport, isExporting] = useMutation<ExportRegionsButton_ExportMutation>(MUTATION);
	return (
		<ExportButton
			isExporting={isExporting}
			doExport={(success) => {
				doExport({
					variables: {},
					onCompleted: (response) => {
						success(response.Region.exportRegions?.file?.url!);
					},
				});
			}}
		/>
	);
};
