import { type ExportPeopleButton_executeDocumentBuilderMutation } from "@relay/ExportPeopleButton_executeDocumentBuilderMutation.graphql";
import { graphql } from "babel-plugin-relay/macro";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { ExportButton } from "@components/export-button";
import { selectPeopleFilters } from "@redux/PeopleSlice";

const MUTATION = graphql`
	mutation ExportPeopleButton_executeDocumentBuilderMutation($name: String) {
		DocumentBuilder {
			executeDocumentBuilder(
				input: {
					input: { PeopleExport: { name: $name, kind: GapReport } }
					fileFormatKind: excel
				}
			) {
				file {
					url
				}
			}
		}
	}
`;

export const ExportPeopleButton = () => {
	const [doExport, isExporting] =
		useMutation<ExportPeopleButton_executeDocumentBuilderMutation>(MUTATION);
	const filters = useSelector(selectPeopleFilters);

	return (
		<ExportButton
			isExporting={isExporting}
			doExport={(success) => {
				doExport({
					variables: {
						name: filters.filterByName,
					},
					onCompleted: (response) => {
						success(response.DocumentBuilder.executeDocumentBuilder?.file?.url!);
					},
				});
			}}
		/>
	);
};
