import { Form } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useMutation } from "react-relay";
import { match } from "ts-pattern";
import * as Yup from "yup";
import { FileFormatSelect } from "@components/file-format-select";
import {
	type DocumentBuilderFileFormatKind,
	type DocumentBuilderInput,
	type GenerateReportButton_ExecuteDocumentBuilderMutation,
} from "@relay/GenerateReportButton_ExecuteDocumentBuilderMutation.graphql";
import { type GenerateReportButton_GenerateAvailabilityForecastExcelMutation } from "@relay/GenerateReportButton_GenerateAvailabilityForecastExcelMutation.graphql";
import { applyFilter } from "@screens/project-view/parts/projects-grid-part/parts/projects-grid-part-content/projects-grid-part-content.utils";
import { ReportTypeSelect } from "./ReportTypeSelect";
import { type GenerateReportButton_GenerateAvailabilityForecastMutation } from "../../__generated__/GenerateReportButton_GenerateAvailabilityForecastMutation.graphql";
import {
	type GenerateReportButton_GenerateReportMutation,
	type ReportType,
} from "../../__generated__/GenerateReportButton_GenerateReportMutation.graphql";
import {
	AvailabilityForecastReportParametersFormPart,
	type AvailabilityForecastReportParametersFormState,
} from "../ui/AvailabilityForecastReportParametersFormPart";
import { DefaultCalendarComponent, DefaultTextFieldComponent } from "../ui/DefaultTextInput";
import {
	FilteredReportParametersFormPart,
	type FilteredReportParametersState,
} from "../ui/FilteredReportParametersFormPart";
import { TkButton } from "../ui/TkButton";
import { TkButtonLink } from "../ui/TkButtonLink";
import { TkDialog } from "../ui/TkDialog";
import { ValidatedField } from "../ui/ValidatedField";

const GENERATE_PROJECT_REPORT_MUTATION = graphql`
	mutation GenerateReportButton_GenerateReportMutation(
		$input: GenerateProjectManagerReportInput!
	) {
		Pdf {
			generateProjectManagerReport(input: $input) {
				file {
					name
					url
				}
			}
		}
	}
`;

const GENERATE_AVAILABILITY_FORECAST_MUTATION = graphql`
	mutation GenerateReportButton_GenerateAvailabilityForecastMutation(
		$input: GenerateAvailabilityForecastReportInput!
	) {
		Pdf {
			generateAvailabilityForecastReport(input: $input) {
				file {
					name
					url
				}
			}
		}
	}
`;
const GENERATE_AVAILABILITY_FORECAST_EXCEL_MUTATION = graphql`
	mutation GenerateReportButton_GenerateAvailabilityForecastExcelMutation(
		$input: GenerateAvailabilityForecastExcelReportInput!
	) {
		Pdf {
			generateAvailabilityForecastExcelReport(input: $input) {
				file {
					name
					url
				}
			}
		}
	}
`;

const EXECUTE_DOCUMENT_BUILDER_MUTATION = graphql`
	mutation GenerateReportButton_ExecuteDocumentBuilderMutation(
		$input: ExecuteDocumentBuilderInput!
	) {
		DocumentBuilder {
			executeDocumentBuilder(input: $input) {
				file {
					name
					url
				}
			}
		}
	}
`;

interface OwnProps {
	className?: string;
	scenarioId: string;
}

export interface ReportParametersFormState {
	titleOpt?: string;
	reportType: ReportType;
	fromOpt?: string;
	toOpt?: string;
	tableHighlightColorOpt?: string;
}

export const GenerateReportButton = ({ className, scenarioId }: OwnProps) => {
	const [dialogVisible, setDialogVisible] = useState<boolean>();
	const [generateProjectReport, isGeneratingProjectReport] =
		useMutation<GenerateReportButton_GenerateReportMutation>(GENERATE_PROJECT_REPORT_MUTATION);
	const [generateAvailabilityForecastReport, isGeneratingAvailabilityForecastReport] =
		useMutation<GenerateReportButton_GenerateAvailabilityForecastMutation>(
			GENERATE_AVAILABILITY_FORECAST_MUTATION,
		);
	const [generateAvailabilityForecastExcelReport] =
		useMutation<GenerateReportButton_GenerateAvailabilityForecastExcelMutation>(
			GENERATE_AVAILABILITY_FORECAST_EXCEL_MUTATION,
		);

	const [execute] = useMutation<GenerateReportButton_ExecuteDocumentBuilderMutation>(
		EXECUTE_DOCUMENT_BUILDER_MUTATION,
	);

	const formik = useFormik<
		FilteredReportParametersState | AvailabilityForecastReportParametersFormState
	>({
		initialValues: {
			reportType: "ProjectReport",
			tableHighlightColorOpt: undefined,
			fileFormat: "pdf",
		},
		validationSchema: Yup.object().shape({
			rows: Yup.array().test("rows", function (value) {
				const reportType = this.parent.reportType;

				if (reportType === "AvailabilityForecast" && (!value || value.length === 0)) {
					return this.createError({
						path: "rows",
						message: "You need to provide at least one row.",
					});
				}
				return true;
			}),
		}),
		enableReinitialize: true,
		onSubmit: (values, { setSubmitting }) => {
			match(values.reportType)
				.with("AvailabilityForecast", () => {
					const valuesAs = values as AvailabilityForecastReportParametersFormState;
					if (!valuesAs.fileFormat || valuesAs.fileFormat === "pdf") {
						generateAvailabilityForecastReport({
							variables: {
								input: {
									scenarioId,
									fromOpt: valuesAs.fromOpt,
									toOpt: valuesAs.toOpt,
									titleOpt: applyFilter(valuesAs.titleOpt),
									filterByDivisionsOpt: valuesAs.filterByDivisionsOpt,
									filterByRegionsOpt: valuesAs.filterByRegionsOpt,
									filterByProjectsOpt: valuesAs.filterByProjectsOpt,
									filterByStagesOpt: valuesAs.filterByStagesOpt,
									rows: valuesAs.rows,
									countPossibleUtilizationNotPeople:
										valuesAs.countPossibleUtilizationNotPeople ?? false,
									showProjects: valuesAs.showProjects ?? false,
								},
							},
							onCompleted: (r) => {
								if (r.Pdf.generateAvailabilityForecastReport?.file?.url) {
									window.open(
										r.Pdf.generateAvailabilityForecastReport?.file?.url,
										"_blank",
									);
								}
								setSubmitting(false);
							},
							onError: () => {
								setSubmitting(false);
							},
						});
					} else if (valuesAs.fileFormat === "excel") {
						generateAvailabilityForecastExcelReport({
							variables: {
								input: {
									scenarioId,
									fromOpt: valuesAs.fromOpt,
									toOpt: valuesAs.toOpt,
									titleOpt: applyFilter(valuesAs.titleOpt),
									filterByDivisionsOpt: valuesAs.filterByDivisionsOpt,
									filterByRegionsOpt: valuesAs.filterByRegionsOpt,
									filterByProjectsOpt: valuesAs.filterByProjectsOpt,
									rows: valuesAs.rows,
									countPossibleUtilizationNotPeople:
										valuesAs.countPossibleUtilizationNotPeople ?? false,
									showProjects: valuesAs.showProjects ?? false,
								},
							},
							onCompleted: (r) => {
								if (r.Pdf.generateAvailabilityForecastExcelReport?.file?.url) {
									window.open(
										r.Pdf.generateAvailabilityForecastExcelReport?.file?.url,
										"_blank",
									);
								}
								setSubmitting(false);
							},
							onError: () => {
								setSubmitting(false);
							},
						});
					}
				})
				.with("RandAssignmentsReport", () => {
					const valuesAs = values as FilteredReportParametersState;
					generateProjectReport({
						variables: {
							input: {
								scenarioId,
								reportType: valuesAs.reportType,
								fromOpt: valuesAs.fromOpt,
								toOpt: valuesAs.toOpt,
								titleOpt: applyFilter(valuesAs.titleOpt),
								filterByDivisionsOpt: valuesAs.filterByDivisionsOpt,
								filterByAssignmentRolesOpt: valuesAs.filterByAssignmentRolesOpt,
								filterByProjectsOpt: valuesAs.filterByProjectsOpt,
								filterByProjectStageRefsOpt: valuesAs.filterByProjectStageRefsOpt,
								filterByRegionsOpt: valuesAs.filterByRegionsOpt,
								filterByExecutivesOpt: valuesAs.filterByExecutivesOpt,
								filterByJobTitleOpt: applyFilter(valuesAs.filterByJobTitleOpt),
								// @ts-expect-error
								filterByPeopleOpt: valuesAs.filterByPeopleOpt?.includes(null)
									? undefined
									: valuesAs.filterByPeopleOpt,
								tableHighlightColorOpt: valuesAs.tableHighlightColorOpt?.length
									? valuesAs.tableHighlightColorOpt
									: undefined,
								filterByAssignmentTagsOpt: valuesAs.filterByAssignmentTagsOpt,
							},
						},
						onCompleted: (r) => {
							if (r.Pdf.generateProjectManagerReport?.file?.url) {
								window.open(
									r.Pdf.generateProjectManagerReport?.file?.url,
									"_blank",
								);
							}
							setSubmitting(false);
						},
						onError: () => {
							setSubmitting(false);
						},
					});
				})
				.otherwise(() => {
					const valuesAs = values as FilteredReportParametersState;
					const input: DocumentBuilderInput = {
						[valuesAs.reportType]: {
							scenarioRef: scenarioId,
							fromOpt: valuesAs.fromOpt,
							toOpt: valuesAs.toOpt,
							titleOpt: applyFilter(valuesAs.titleOpt),
							filterByDivisionsOpt: applyFilter(valuesAs.filterByDivisionsOpt),
							filterByAssignmentRolesOpt: applyFilter(
								valuesAs.filterByAssignmentRolesOpt,
							),
							filterByProjectsOpt: applyFilter(valuesAs.filterByProjectsOpt),
							filterByProjectStageRefsOpt: applyFilter(
								valuesAs.filterByProjectStageRefsOpt,
							),
							filterByRegionsOpt: applyFilter(valuesAs.filterByRegionsOpt),
							filterByExecutivesOpt: applyFilter(valuesAs.filterByExecutivesOpt),
							filterByJobTitleOpt: applyFilter(valuesAs.filterByJobTitleOpt),
							// @ts-expect-error
							filterByPeopleOpt: valuesAs.filterByPeopleOpt?.includes(null)
								? undefined
								: valuesAs.filterByPeopleOpt,
							backgroundColorOpt: valuesAs.tableHighlightColorOpt?.length
								? valuesAs.tableHighlightColorOpt
								: undefined,
							filterByAssignmentTagsOpt: applyFilter(
								valuesAs.filterByAssignmentTagsOpt,
							),
							useAlternatingRowColors: true,
							kind: valuesAs.reportType,
						},
					};

					execute({
						variables: {
							input: {
								input: {
									...input,
								},
								fileFormatKind: valuesAs.fileFormat ?? "pdf",
							},
						},
						onCompleted: (r) => {
							if (r?.DocumentBuilder.executeDocumentBuilder?.file?.url) {
								window.open(
									r?.DocumentBuilder.executeDocumentBuilder?.file?.url,
									"_blank",
								);
							}
							setSubmitting(false);
						},
					});
				});
		},
	});

	type FormikOptions =
		| "fromOpt"
		| "toOpt"
		| "filterByAssignmentRolesOpt"
		| "filterByPeopleOpt"
		| "filterByProjectStageRefsOpt"
		| "filterByProjectsOpt"
		| "filterByRegionsOpt"
		| "filterByDivisionsOpt"
		| "rows"
		| "countPossibleUtilizationNotPeople"
		| "fileFormat";

	const resetHandler = (reportType: ReportType) => {
		const map: Partial<Record<ReportType, FormikOptions[]>> = {
			ProjectReport: ["filterByAssignmentRolesOpt", "fromOpt", "toOpt", "filterByPeopleOpt"],
			UnstaffedReport: ["filterByPeopleOpt"],
			AvailabilityReport: ["filterByProjectStageRefsOpt", "filterByProjectsOpt"],
		};

		map[reportType]?.forEach((o) => {
			void formik.setFieldValue(o, undefined, false);
		});
	};

	return (
		<div className={className}>
			<TkButton
				onClick={() => {
					setDialogVisible(true);
				}}
				className="pt-1 pb-1"
				icon={
					isGeneratingProjectReport || isGeneratingAvailabilityForecastReport
						? "pi pi-spin pi-spinner"
						: "pi pi-file-pdf"
				}
				disabled={isGeneratingProjectReport || isGeneratingAvailabilityForecastReport}
				type="submit"
				tooltip={"Download Report"}
			/>

			<TkDialog
				visible={dialogVisible}
				onHide={() => {
					setDialogVisible(false);
				}}
				header={<h1>Generate report</h1>}
				footer={
					<div className="flex">
						<TkButtonLink
							disabled={formik.isSubmitting}
							type="button"
							onClick={() => {
								setDialogVisible(false);
							}}
							label={"Cancel"}
							className="m-auto w-auto"
						/>
						<TkButtonLink
							disabled={formik.isSubmitting}
							onClick={() => {
								formik.handleSubmit();
							}}
							label={isGeneratingProjectReport ? "Generating..." : "Download"}
							className="m-auto w-auto"
						/>
					</div>
				}
			>
				<Form onSubmit={formik.handleSubmit}>
					<ValidatedField<ReportParametersFormState, string>
						className="mb-4"
						name={"titleOpt"}
						label={"Report Title"}
						formikConfig={formik}
						placeholder={translateReportType(formik.values.reportType)}
						component={DefaultTextFieldComponent}
					/>
					<ValidatedField<ReportParametersFormState, ReportType>
						className="mb-4"
						name={"reportType"}
						label={"Report type"}
						formikConfig={formik}
						component={ReportTypeSelect}
						onChange={(e) => {
							resetHandler(e as ReportType);
						}}
					/>
					<ValidatedField<ReportParametersFormState, string>
						className="mb-4"
						name={"fromOpt"}
						label={"From"}
						placeholder={"Leave empty to use current date"}
						formikConfig={formik}
						component={DefaultCalendarComponent}
					/>
					<ValidatedField<ReportParametersFormState, string>
						className="mb-4"
						name={"toOpt"}
						label={"To date"}
						placeholder={"Leave empty to use furthest out assignment end date"}
						formikConfig={formik}
						component={DefaultCalendarComponent}
					/>
					{formik.values.reportType !== "AvailabilityForecast" && (
						<FilteredReportParametersFormPart scenarioId={scenarioId} formik={formik} />
					)}
					{formik.values.reportType === "AvailabilityForecast" && (
						<AvailabilityForecastReportParametersFormPart formik={formik as any} />
					)}
					{formik.values.reportType !== "RandAssignmentsReport" && (
						<ValidatedField<
							FilteredReportParametersState,
							DocumentBuilderFileFormatKind
						>
							name={"fileFormat"}
							label={"File format"}
							placeholder={"File format"}
							formikConfig={formik}
							component={FileFormatSelect}
						/>
					)}
				</Form>
			</TkDialog>
		</div>
	);
};

const translateReportType = (reportType: any) => {
	switch (reportType) {
		case "LondonOpsSuperReport":
			return "Recently changed assignments (London Ops)";
		case "GroupedResourceReport":
			return "Grouped by Resource Report";
		case "GroupedResourceDayReport":
			return "Grouped by Resource Report (Day Gantt)";
		case "ProjectReport":
			return "Project Report";
		case "UnstaffedPositionsReport":
			return "Unstaffed Report";
		case "GroupedByStagesReport":
			return "Grouped by Stage Report";
		case "GapReport":
			return "Gap Report";
		case "AvailabilityReport":
			return "Availability Report";
		case "AvailabilityForecast":
			return "Availability Forecast Report";
		case "CurrentFieldStaffLocationReport":
			return "Current Field Staff Location Report";
		case "GroupedByStagesNextAssignmentReport":
			return "Grouped by Stage Report (with next Assignment)";
		case "AssignmentsWithSupersReport":
			return "Recently changed assignments";
		case "RandAssignmentsReport":
			return "Resource Report";
		case "GroupedByStagesWithContactInfoReport":
			return "Grouped by Stages w Contact Info";
		default:
			return "";
	}
};
