import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { ExportButton } from "@components/export-button";
import { type ExportStaffingTemplatesButton_ExportMutation } from "../../__generated__/ExportStaffingTemplatesButton_ExportMutation.graphql";

const MUTATION = graphql`
	mutation ExportStaffingTemplatesButton_ExportMutation {
		Template {
			exportStaffingTemplates(input: {}) {
				file {
					url
				}
			}
		}
	}
`;

export const ExportStaffingTemplatesButton = () => {
	const [doExport, isExporting] =
		useMutation<ExportStaffingTemplatesButton_ExportMutation>(MUTATION);
	return (
		<ExportButton
			isExporting={isExporting}
			doExport={(success) => {
				doExport({
					variables: {},
					onCompleted: (response) => {
						success(response.Template.exportStaffingTemplates?.file?.url!);
					},
				});
			}}
		/>
	);
};
