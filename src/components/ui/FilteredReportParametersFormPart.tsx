import { type FormikState } from "formik";
import React from "react";
import { ExecutivesSelect } from "@components/executives-select";
import { DefaultColorPickerComponent } from "@components/relay/default-color-picker";
import { TagsSelect } from "@components/tags-select";
import { type DocumentBuilderFileFormatKind } from "@relay/GenerateReportButton_ExecuteDocumentBuilderMutation.graphql";
import { ValidatedField } from "./ValidatedField";
import { AssignmentRolesSelect } from "../relay/AssignmentRolesSelect";
import { DivisionsSelect } from "../relay/DivisionsSelect";
import { type ReportParametersFormState } from "../relay/GenerateReportButton";
import { PeopleSelect } from "../relay/people-select";
import { ProjectsSelectField } from "../relay/ProjectsSelectField";
import { ProjectStagesSelect } from "../relay/ProjectStagesSelect";
import { RegionsSelect } from "../relay/RegionsSelect";

export interface FilteredReportParametersState extends ReportParametersFormState {
	filterByPeopleOpt?: string[];
	filterByProjectsOpt?: string[];
	filterByProjectStageRefsOpt?: string[];
	filterByAssignmentRolesOpt?: string[];
	filterByRegionsOpt?: string[];
	filterByDivisionsOpt?: string[];
	filterByExecutivesOpt?: string[];
	filterByAssignmentTagsOpt?: string[];
	filterByJobTitleOpt?: string[];
	fileFormat?: DocumentBuilderFileFormatKind;
}

interface OwnProps {
	scenarioId: string;
	formik: FormikState<FilteredReportParametersState> & {
		setFieldTouched: (
			field: string,
			touched?: boolean,
			shouldValidate?: boolean | undefined,
		) => any;
		setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => any;
	};
}

export const FilteredReportParametersFormPart = ({ formik, scenarioId }: OwnProps) => {
	return (
		<>
			<ValidatedField<FilteredReportParametersState, string[]>
				className="mb-4"
				name={"filterByPeopleOpt"}
				label={"Filter by staff"}
				disabled={formik.values.reportType === "UnstaffedReport"}
				formikConfig={formik}
				placeholder={"All staff"}
				component={PeopleSelect}
			/>
			<ValidatedField<FilteredReportParametersState, string[]>
				className="mb-4"
				name={"filterByProjectStageRefsOpt"}
				disabled={formik.values.reportType === "AvailabilityReport"}
				label={"Filter by project stages"}
				formikConfig={formik}
				placeholder={"All stages"}
				component={ProjectStagesSelect}
			/>
			<ValidatedField<FilteredReportParametersState, string[]>
				className="mb-4"
				disabled={formik.values.reportType === "AvailabilityReport"}
				name={"filterByProjectsOpt"}
				label={"Filter by project"}
				formikConfig={formik}
				placeholder={"All projects"}
				component={(fieldConfig) => <ProjectsSelectField fieldConfig={fieldConfig} />}
			/>
			<ValidatedField<FilteredReportParametersState, string[]>
				className="mb-4"
				name={"filterByAssignmentRolesOpt"}
				label={"Filter by assignment roles"}
				formikConfig={formik}
				placeholder={"All roles"}
				component={AssignmentRolesSelect}
			/>
			<ValidatedField<FilteredReportParametersState, string[]>
				className="mb-4"
				name={"filterByRegionsOpt"}
				label={"Filter by region"}
				formikConfig={formik}
				placeholder={"All regions"}
				component={RegionsSelect}
			/>
			<ValidatedField<FilteredReportParametersState, string[]>
				className="mb-4"
				name={"filterByDivisionsOpt"}
				label={"Filter by division"}
				placeholder={"All division"}
				formikConfig={formik}
				component={DivisionsSelect}
			/>
			<ValidatedField<FilteredReportParametersState, string[]>
				className={"mb-4"}
				label={"Filter by executives"}
				placeholder={"All executives"}
				name={"filterByExecutivesOpt"}
				formikConfig={formik}
				component={(renderConfig) => (
					<ExecutivesSelect scenarioId={scenarioId} {...renderConfig} />
				)}
			/>
			<ValidatedField<FilteredReportParametersState, string[]>
				className={"mb-4"}
				label={"Filter by assignment tags"}
				placeholder={"Select tags"}
				name={"filterByAssignmentTagsOpt"}
				formikConfig={formik}
				component={(renderConfig) => <TagsSelect {...renderConfig} />}
			/>
			<ValidatedField<FilteredReportParametersState, string[]>
				className={"mb-4"}
				label={"Filter by job titles"}
				placeholder={"Select job titles"}
				name={"filterByJobTitleOpt"}
				formikConfig={formik}
				component={(renderConfig) => <AssignmentRolesSelect {...renderConfig} />}
			/>
			<ValidatedField<ReportParametersFormState, string>
				className="mb-4"
				name={"tableHighlightColorOpt"}
				label={"Table Highlight Color"}
				formikConfig={formik}
				component={DefaultColorPickerComponent}
			/>
		</>
	);
};
