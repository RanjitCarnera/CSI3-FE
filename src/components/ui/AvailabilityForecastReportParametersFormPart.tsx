import { type DropdownOption } from "@thekeytechnology/epic-ui/dist/components/dropdown/dropdown.types";
import { type FormikState } from "formik";
import { Dropdown } from "primereact/dropdown";
import React from "react";
import { ProjectsSelectField } from "@components/relay/ProjectsSelectField";
import { ProjectStagesSelect } from "@components/relay/ProjectStagesSelect";
import type { AvailabilityForecastKindEnum } from "@relay/GenerateAvailabilityForecastForm_DayAvailabilityForecastInlineFragment.graphql";
import { type DocumentBuilderFileFormatKind } from "@relay/GenerateReportButton_ExecuteDocumentBuilderMutation.graphql";
import { AvailabilityForecastReportRowField } from "./AvailabilityForecastReportRowField";
import { DefaultSwitchComponent } from "./DefaultTextInput";
import { ValidatedField, type ValidatedFieldConfig } from "./ValidatedField";
import { type ForecastRowParameter } from "../../redux/AvailabilityForecastSlice";
import { DivisionsSelect } from "../relay/DivisionsSelect";
import { type ReportParametersFormState } from "../relay/GenerateReportButton";
import { RegionsSelect } from "../relay/RegionsSelect";

export interface AvailabilityForecastReportParametersFormState extends ReportParametersFormState {
	filterByDivisionsOpt?: string[];
	filterByRegionsOpt?: string[];
	filterByStagesOpt?: string[];
	filterByProjectsOpt?: string[];
	rows: ForecastRowParameter[];
	countPossibleUtilizationNotPeople?: boolean;
	showProjects?: boolean;
	fileFormat?: DocumentBuilderFileFormatKind;
	capInMonths: number;

	kind: AvailabilityForecastKindEnum;
}

interface OwnProps {
	formik: FormikState<AvailabilityForecastReportParametersFormState> & {
		setFieldTouched: (
			field: string,
			touched?: boolean,
			shouldValidate?: boolean | undefined,
		) => any;
		setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => any;
	};
}

export const AvailabilityForecastReportParametersFormPart = ({ formik }: OwnProps) => {
	const disableForecastCap = Boolean(formik.values.fromOpt || formik.values.toOpt);
	return (
		<>
			<ValidatedField<AvailabilityForecastReportParametersFormState, string[]>
				className="mb-4"
				disabled={formik.values.reportType === "AvailabilityReport"}
				name={"filterByDivisionsOpt"}
				label={"Filter by division"}
				placeholder={"All division"}
				formikConfig={formik}
				component={DivisionsSelect}
			/>

			<ValidatedField<AvailabilityForecastReportParametersFormState, string[]>
				className="mb-4"
				disabled={formik.values.reportType === "AvailabilityReport"}
				name={"filterByRegionsOpt"}
				label={"Filter by region"}
				placeholder={"All regions"}
				formikConfig={formik}
				component={RegionsSelect}
			/>
			<ValidatedField<AvailabilityForecastReportParametersFormState, string[]>
				className="mb-4"
				disabled={formik.values.reportType === "AvailabilityReport"}
				name={"filterByStagesOpt"}
				label={"Filter by stages"}
				placeholder={"All Stages"}
				formikConfig={formik}
				component={ProjectStagesSelect}
			/>

			<ValidatedField<AvailabilityForecastReportParametersFormState, string[]>
				className="mb-4"
				disabled={formik.values.reportType === "AvailabilityReport"}
				name={"filterByProjectsOpt"}
				label={"Filter by projects"}
				placeholder={"All Projects"}
				formikConfig={formik}
				component={(renderConfig) => (
					<ProjectsSelectField
						fieldConfig={renderConfig}
						excludeIds={[]}
						{...renderConfig}
					/>
				)}
			/>

			<ValidatedField<AvailabilityForecastReportParametersFormState, ForecastRowParameter[]>
				className="mb-4"
				name={"rows"}
				label={"Rows in report"}
				formikConfig={formik}
				component={AvailabilityForecastReportRowField}
			/>

			<ValidatedField<AvailabilityForecastReportParametersFormState, boolean>
				className="mb-4"
				name={"countPossibleUtilizationNotPeople"}
				label={"Show slots instead of people"}
				helpText={
					<>
						If selected this will display slots (as in the maximum number
						<br /> of projects for a given role) instead of people.
					</>
				}
				formikConfig={formik}
				component={DefaultSwitchComponent}
			/>
			<ValidatedField<AvailabilityForecastReportParametersFormState, boolean>
				className="mb-4"
				name={"showProjects"}
				label={"Show Project Count"}
				helpText={<>If selected this will display all active projects.</>}
				formikConfig={formik}
				component={DefaultSwitchComponent}
			/>
			<ValidatedField<
				AvailabilityForecastReportParametersFormState,
				AvailabilityForecastKindEnum
			>
				name={"kind"}
				label={"Interval"}
				placeholder={"Select an interval"}
				formikConfig={formik}
				component={AvailabilityForecastKindEnumDropdown}
			/>
			<ValidatedField<
				AvailabilityForecastReportParametersFormState,
				AvailabilityForecastKindEnum
			>
				disabled={disableForecastCap}
				name={"capInMonths"}
				label={"Cap in months"}
				placeholder={"Select a forecast cap"}
				formikConfig={formik}
				component={AvailabilityForecastCapInMonthsDropdown}
			/>
		</>
	);
};

const AvailabilityForecastCapInMonthsDropdown = (
	validatedConfig: ValidatedFieldConfig<AvailabilityForecastKindEnum>,
) => (
	<Dropdown
		disabled={validatedConfig.disabled}
		options={
			// @ts-expect-error
			[
				{
					label: "By 3 months",
					value: 3,
				},
				{
					label: "By 6 months",
					value: 6,
				},
				{
					label: "By 12 months",
					value: 12,
				},
				{
					label: "By 18 months",
					value: 18,
				},
				{
					label: "By 24 months",
					value: 24,
				},
				{
					label: "By 36 months",
					value: 36,
				},
			] as DropdownOption[]
		}
		value={validatedConfig.fieldValue}
		onChange={(e) => {
			validatedConfig.updateField(e.value);
		}}
	/>
);

export const AvailabilityForecastKindEnumDropdown = (
	validatedConfig: ValidatedFieldConfig<AvailabilityForecastKindEnum>,
) => (
	<Dropdown
		options={
			[
				{
					label: "By days",
					value: "DayAvailabilityForecast",
				},
				{
					label: "By week",
					value: "CalendarWeekAvailabilityForecast",
				},
				{
					label: "By month",
					value: "YearMonthAvailabilityForecast",
				},
				{
					label: "By quarter",
					value: "YearQuarterAvailabilityForecast",
				},
			] as DropdownOption[]
		}
		value={validatedConfig.fieldValue}
		onChange={(e) => {
			validatedConfig.updateField(e.value);
		}}
	/>
);
