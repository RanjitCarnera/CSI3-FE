import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { ExportButton } from "@components/export-button";
import { type ExportSkillsButton_ExportMutation } from "../../__generated__/ExportSkillsButton_ExportMutation.graphql";

const MUTATION = graphql`
	mutation ExportSkillsButton_ExportMutation {
		Skills {
			exportSkills(input: {}) {
				file {
					url
				}
			}
		}
	}
`;

export const ExportSkillsButton = () => {
	const [doExport, isExporting] = useMutation<ExportSkillsButton_ExportMutation>(MUTATION);
	return (
		<ExportButton
			isExporting={isExporting}
			doExport={(success) => {
				doExport({
					variables: {},
					onCompleted: (response) => {
						success(response.Skills.exportSkills?.file?.url!);
					},
				});
			}}
		/>
	);
};
