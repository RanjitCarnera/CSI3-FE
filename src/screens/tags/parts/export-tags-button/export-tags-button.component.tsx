import { useContext } from "react";
import { useMutation } from "react-relay";
import { ExportButton } from "@components/export-button";
import { type exportTagsButton_executeDocumentBuilderMutation } from "@relay/exportTagsButton_executeDocumentBuilderMutation.graphql";
import { EXPORT_TAGS_MUTATION } from "@screens/tags/parts/export-tags-button/export-tags-button.graphql";
import { SettingsTagsContext } from "@screens/tags/tags.context";

export const ExportTagsButton = () => {
	const [doExport, isExporting] =
		useMutation<exportTagsButton_executeDocumentBuilderMutation>(EXPORT_TAGS_MUTATION);
	const { name } = useContext(SettingsTagsContext);
	return (
		<ExportButton
			isExporting={isExporting}
			doExport={(success) => {
				doExport({
					variables: {
						input: {
							input: {
								TagsExport: {
									name,
									kind: "TagsExport",
								},
							},
							fileFormatKind: "excel",
						},
					},
					onCompleted: (response) => {
						success(response.DocumentBuilder.executeDocumentBuilder?.file?.url!);
					},
				});
			}}
		/>
	);
};
