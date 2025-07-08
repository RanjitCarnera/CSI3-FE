import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { match } from "ts-pattern";
import { ExportButton } from "@components/export-button";
import { selectScenarioProjectFilters } from "@redux/ProjectViewSlice";
import { type exportAssignmentsButton_executeDocumentBuilderMutation } from "@relay/exportAssignmentsButton_executeDocumentBuilderMutation.graphql";
import { type Staffing } from "@relay/exportTagsButton_executeDocumentBuilderMutation.graphql";
import { EXPORT_ASSIGNMENTS_MUTATION } from "@screens/project-view/parts/projects-grid-part/parts/export-assignments-button/export-assignments-button.graphql";
import { type ExportAssignmentsButtonProps } from "@screens/project-view/parts/projects-grid-part/parts/export-assignments-button/export-assignments-button.types";
import { applyFilter } from "../projects-grid-part-content/projects-grid-part-content.utils";

export const ExportAssignmentsButton = ({ scenarioId }: ExportAssignmentsButtonProps) => {
	const [doExport, isExporting] =
		useMutation<exportAssignmentsButton_executeDocumentBuilderMutation>(
			EXPORT_ASSIGNMENTS_MUTATION,
		);
	const projectFilters = useSelector(selectScenarioProjectFilters);
	return (
		<ExportButton
			isExporting={isExporting}
			doExport={(success) => {
				doExport({
					variables: {
						input: {
							input: {
								AssignmentsExport: {
									scenarioRef: scenarioId,
									projectFiltersOpt: {
										name: applyFilter(projectFilters.filterByName),
										divisions: applyFilter(projectFilters.filterByDivisions),
										regions: applyFilter(projectFilters.filterByRegions),
										stages: applyFilter(projectFilters.filterByStage),
										inDateRange:
											projectFilters.filterByDateFrom ||
											projectFilters.filterByDateTo
												? {
														from: projectFilters.filterByDateFrom,
														to: projectFilters.filterByDateTo,
												  }
												: undefined,
										executives: applyFilter(projectFilters.filterByExecutives),
										staffing: match(projectFilters.filterByStaffing)
											.returnType<Staffing | undefined>()
											.with("Fully staffed", () => "FullyStaffed")
											.with("Not Fully Staffed", () => "NotFullyStaffed")
											.otherwise(() => undefined),
									},
									personFiltersOpt: {
										jobTitles: applyFilter(
											projectFilters.filterByAssignmentRoles,
										),
										executives: applyFilter(projectFilters.filterByExecutives),
										ids: applyFilter(projectFilters.filterByStaff),
										skillFilters: applyFilter(projectFilters.filterBySkills),
										assignmentStatus: applyFilter(
											projectFilters.filterByAssignmentStatus,
										),
									},
									kind: "AssignmentsExport",
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
