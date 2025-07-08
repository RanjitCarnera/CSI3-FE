import { useMutation } from "react-relay";
import { ExportButton } from "@components/export-button";
import { EXPORT_DIVISIONS_MUTATION } from "@components/export-divisions-button/export-divisions-button.graphql";
import { type exportDivisionsButton_ExportDivisionsMutation } from "@relay/exportDivisionsButton_ExportDivisionsMutation.graphql";

export const ExportDivisionsButton = () => {
	const [doExport, isExporting] =
		useMutation<exportDivisionsButton_ExportDivisionsMutation>(EXPORT_DIVISIONS_MUTATION);
	return (
		<ExportButton
			isExporting={isExporting}
			doExport={(success) => {
				doExport({
					variables: {},
					onCompleted: (response) => {
						success(response.Division.exportDivisions?.file?.url!);
					},
				});
			}}
		/>
	);
};
