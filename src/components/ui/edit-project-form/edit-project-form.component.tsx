import { Form, Label } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import { type FormikProps } from "formik/dist/types";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import React, { useEffect, useImperativeHandle, useState } from "react";
import * as Yup from "yup";
import { LaborCostCalculationStatus } from "@components/ui/edit-project-form/edit-project-form.consts";
import {
	type EditProjectFormProps,
	type EditProjectFormState,
	type Milestone,
} from "./edit-project-form.interface";
import { MilestonesField } from "./milestones-field.component";
import { DivisionSelect } from "../../relay/DivisionSelect";
import { TaggedFileSelectionField } from "../../relay/FileSelectionField";
import { ProjectStageSelect } from "../../relay/ProjectStageSelect";
import { RegionSelect } from "../../relay/RegionSelect";
import { SkillMultiSelect } from "../../relay/skill-multi-select";
import { AddressDisplay } from "../AddressDisplay";
import { type Address, AddressField } from "../AddressField";
import { CurrencyDisplay } from "../CurrencyDisplay";
import { DateDisplay } from "../DateTimeDisplay";
import {
	DefaultCalendarComponent,
	DefaultNumberFieldComponent,
	DefaultPercentageFieldComponent,
	DefaultSwitchComponent,
	DefaultTextAreaComponent,
	DefaultTextFieldComponent,
} from "../DefaultTextInput";
import { TkMessage } from "../TkMessage";
import { ValidatedField, type ValidatedFieldConfig } from "../ValidatedField";
import { ValidatedFieldWithComparison } from "../ValidatedFieldWithCompare";

export const EditProjectForm = React.forwardRef<
	FormikProps<EditProjectFormState>,
	EditProjectFormProps
>(({ initialState, onSubmit, comparisonProjectState }, ref) => {
	const [selectedForOverwrite, setSelectedForOverwrite] = useState<
		Array<keyof EditProjectFormState>
	>([]);

	const formik = useFormik<EditProjectFormState>({
		initialValues: initialState || {},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			name: Yup.string().required("Name is a required field."),
			address: Yup.object().optional().nullable(),
			stageRef: Yup.string().required("Stage is a required field."),
			startDate: Yup.string().optional().nullable(),
			endDate: Yup.string().optional().nullable(),
			milestones: Yup.array(
				Yup.object().shape({
					id: Yup.string().optional(),
					name: Yup.string(),
					date: Yup.string(),
				}),
			).test("yourTestCondition3", function (value, testContext) {
				(value as Milestone[])?.forEach((ms) => {
					if (ms.name && !ms.date) {
						return this.createError({
							path: "milestones",
							message: "Required",
						});
					}
				});
				return true;
			}),
			skills: Yup.array(),
			comments: Yup.string().optional(),
			budgetedLaborCosts: Yup.number().optional(),
		}),
		onSubmit: (values, formikHelpers) => {
			let mergedState: EditProjectFormState = comparisonProjectState ? {} : values;

			if (comparisonProjectState) {
				mergedState = Object.entries(values)
					.map(([key, value]) => {
						return {
							[key]: selectedForOverwrite?.includes(key as keyof EditProjectFormState)
								? comparisonProjectState[key as keyof EditProjectFormState]
								: value,
						};
					})
					.reduce((a, b) => ({ ...a, ...b }));
			}

			onSubmit(mergedState, formikHelpers);
		},
	});

	useImperativeHandle(ref, () => ({
		...formik,
	}));

	const [laborCostCalculationStatus, setLaborCostCalculationStatus] = useState(
		formik.values.budgetedLaborCosts
			? LaborCostCalculationStatus.Const
			: LaborCostCalculationStatus.Percentage,
	);

	useEffect(() => {
		if (laborCostCalculationStatus === LaborCostCalculationStatus.Percentage) return;
		if (!formik.values.volume) return;
		if (formik.values.budgetedLaborCosts === undefined) return;
		const calculatedPercentage = formik.values.budgetedLaborCosts / formik.values.volume;

		void formik.setFieldValue("generalConditionsPercentage", calculatedPercentage);
	}, [formik.values.budgetedLaborCosts]);

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedFieldWithComparison<EditProjectFormState, string>
				className="mb-4"
				name={"name"}
				label={"Name"}
				required={true}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
				enableComparison={!!comparisonProjectState}
				comparisonState={comparisonProjectState}
				selectedKeys={selectedForOverwrite}
				setSelectedKeys={setSelectedForOverwrite}
				comparisonComponent={(value) => <>{value}</>}
			/>

			<ValidatedFieldWithComparison<EditProjectFormState, string>
				className="mb-4"
				name={"projectIdentifier"}
				label={"Project Identifier"}
				helpText={"Should be unique among all projects"}
				required={true}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
				enableComparison={!!comparisonProjectState}
				comparisonState={comparisonProjectState}
				selectedKeys={selectedForOverwrite}
				setSelectedKeys={setSelectedForOverwrite}
				comparisonComponent={(value) => <>{value}</>}
			/>

			<ValidatedFieldWithComparison<EditProjectFormState, Address>
				className="mb-4"
				name={"address"}
				label={"Address"}
				formikConfig={formik}
				component={AddressField}
				enableComparison={!!comparisonProjectState}
				comparisonState={comparisonProjectState}
				selectedKeys={selectedForOverwrite}
				setSelectedKeys={setSelectedForOverwrite}
				comparisonComponent={(value) => <AddressDisplay value={value} />}
			/>

			<ValidatedFieldWithComparison<EditProjectFormState, string>
				className="mb-4"
				name={"startDate"}
				label={"Start date"}
				formikConfig={formik}
				component={DefaultCalendarComponent}
				enableComparison={!!comparisonProjectState}
				comparisonState={comparisonProjectState}
				selectedKeys={selectedForOverwrite}
				setSelectedKeys={setSelectedForOverwrite}
				comparisonComponent={(value) => <DateDisplay value={value} />}
			/>

			{((formik.touched.startDate && initialState) ||
				selectedForOverwrite.includes("startDate")) && (
				<TkMessage
					severity="info"
					className="mb-4"
					content={
						<div className="flex align-items-center">
							<ValidatedField<EditProjectFormState, boolean>
								className="m-0 flex align-items-center"
								name={"moveAssigmentStartDates"}
								required={true}
								formikConfig={formik}
								component={DefaultSwitchComponent}
							/>
							<div className="ml-2">
								Check this if you also want to change the
								<br /> start date of all future assignments?
							</div>
						</div>
					}
				/>
			)}

			<ValidatedFieldWithComparison<EditProjectFormState, string>
				className="mb-4"
				name={"endDate"}
				label={"End date"}
				formikConfig={formik}
				component={DefaultCalendarComponent}
				enableComparison={!!comparisonProjectState}
				comparisonState={comparisonProjectState}
				selectedKeys={selectedForOverwrite}
				setSelectedKeys={setSelectedForOverwrite}
				comparisonComponent={(value) => <DateDisplay value={value} />}
			/>

			{((formik.touched.endDate && initialState) ||
				selectedForOverwrite.includes("endDate")) && (
				<TkMessage
					severity="info"
					className="mb-4"
					content={
						<div className="flex align-items-center">
							<ValidatedField<EditProjectFormState, boolean>
								className="m-0 flex align-items-center"
								name={"moveAssigmentEndDates"}
								required={true}
								formikConfig={formik}
								component={DefaultSwitchComponent}
							/>
							<div className="ml-2">
								Check this if you also want to change the
								<br /> end date of all future assignments?
							</div>
						</div>
					}
				/>
			)}

			<ValidatedFieldWithComparison<EditProjectFormState, string>
				className="mb-4"
				name={"divisionRef"}
				label={"Division"}
				formikConfig={formik}
				component={DivisionSelect}
				enableComparison={!!comparisonProjectState}
				comparisonState={comparisonProjectState}
				selectedKeys={selectedForOverwrite}
				setSelectedKeys={setSelectedForOverwrite}
				comparisonComponent={(value) => (
					<DivisionSelect fieldValue={value} updateField={() => {}} disabled={true} />
				)}
			/>

			<ValidatedFieldWithComparison<EditProjectFormState, string>
				className="mb-4"
				name={"regionRef"}
				label={"Office / Region"}
				formikConfig={formik}
				component={RegionSelect}
				enableComparison={!!comparisonProjectState}
				comparisonState={comparisonProjectState}
				selectedKeys={selectedForOverwrite}
				setSelectedKeys={setSelectedForOverwrite}
				comparisonComponent={(value) => (
					<RegionSelect fieldValue={value} updateField={() => {}} disabled={true} />
				)}
			/>

			<hr />
			<div className="field">
				<Label>Set Hard Budget Or Use Labor Cost Percentage</Label>
				<DefaultSwitchComponent
					isValid={true}
					fieldValue={
						laborCostCalculationStatus === LaborCostCalculationStatus.Percentage
					}
					updateField={(e) => {
						setLaborCostCalculationStatus(
							e
								? LaborCostCalculationStatus.Percentage
								: LaborCostCalculationStatus.Const,
						);
					}}
				/>
			</div>
			<ValidatedFieldWithComparison<EditProjectFormState, number>
				className="mb-4"
				name={"volume"}
				label={"Volume"}
				iconClass="pi pi-dollar"
				formikConfig={formik}
				component={({
					fieldName,
					fieldValue,
					updateField,
					isValid,
					disabled,
				}: ValidatedFieldConfig<number>) => {
					return (
						<InputNumber
							id={fieldName}
							name={fieldName}
							value={fieldValue}
							min={0}
							onChange={(e) => {
								updateField(e.value || 0);
							}}
							disabled={disabled}
							className={classNames({ "p-invalid": !isValid })}
						/>
					);
				}}
				enableComparison={!!comparisonProjectState}
				comparisonState={comparisonProjectState}
				selectedKeys={selectedForOverwrite}
				setSelectedKeys={setSelectedForOverwrite}
				comparisonComponent={(value) => <CurrencyDisplay value={value} />}
			/>
			<ValidatedFieldWithComparison<EditProjectFormState, number>
				className="mb-4"
				disabled={laborCostCalculationStatus === LaborCostCalculationStatus.Const}
				name={"generalConditionsPercentage"}
				label={"Labor Cost percentage"}
				helpText={
					"What percentage of the project volume is labor costs - this will be used to calculate project budgets."
				}
				placeholder="8"
				max={100}
				step={0.001}
				min={0}
				mode={"decimal"}
				locale={"en-US"}
				formikConfig={formik}
				iconClass="pi pi-percentage"
				component={(renderConfig) => (
					<DefaultPercentageFieldComponent
						{...renderConfig}
						updateField={(e) => {
							formik.setFieldValue("generalConditionsPercentage", e);
							formik.setFieldValue("budgetedLaborCosts", undefined);
						}}
					/>
				)}
				enableComparison={!!comparisonProjectState}
				comparisonState={comparisonProjectState}
				selectedKeys={selectedForOverwrite}
				setSelectedKeys={setSelectedForOverwrite}
				comparisonComponent={(value) => (
					<DefaultPercentageFieldComponent
						updateField={() => {}}
						disabled={true}
						fieldValue={value}
					/>
				)}
			/>
			<ValidatedFieldWithComparison<EditProjectFormState, number>
				className="mb-4"
				disabled={laborCostCalculationStatus === LaborCostCalculationStatus.Percentage}
				name={"budgetedLaborCosts"}
				label={"Budgeted Labor Cost"}
				helpText={
					"Give a hard budgeted labor cost - this will be used to calculate project budgets and the labor cost percentage."
				}
				placeholder="-"
				step={1}
				min={0}
				mode={"decimal"}
				locale={"en-US"}
				formikConfig={formik}
				iconClass="pi pi-dollar"
				component={DefaultNumberFieldComponent}
				enableComparison={!!comparisonProjectState}
				comparisonState={comparisonProjectState}
				selectedKeys={selectedForOverwrite}
				setSelectedKeys={setSelectedForOverwrite}
				comparisonComponent={(value) => (
					<DefaultNumberFieldComponent
						updateField={() => {}}
						disabled={true}
						fieldValue={value}
					/>
				)}
			/>
			<hr />

			<ValidatedFieldWithComparison<EditProjectFormState, string>
				className="mb-4"
				name={"stageRef"}
				label={"Stage"}
				formikConfig={formik}
				component={ProjectStageSelect}
				enableComparison={!!comparisonProjectState}
				comparisonState={comparisonProjectState}
				selectedKeys={selectedForOverwrite}
				setSelectedKeys={setSelectedForOverwrite}
				comparisonComponent={(value) => (
					<ProjectStageSelect fieldValue={value} updateField={() => {}} disabled={true} />
				)}
			/>

			<ValidatedFieldWithComparison<EditProjectFormState, string>
				className="mb-4"
				name={"architectName"}
				label={"Architect name"}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
				enableComparison={!!comparisonProjectState}
				comparisonState={comparisonProjectState}
				selectedKeys={selectedForOverwrite}
				setSelectedKeys={setSelectedForOverwrite}
				comparisonComponent={(value) => <>{value}</>}
			/>

			<ValidatedFieldWithComparison<EditProjectFormState, string>
				className="mb-4"
				name={"clientName"}
				label={"Client name"}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
				enableComparison={!!comparisonProjectState}
				comparisonState={comparisonProjectState}
				selectedKeys={selectedForOverwrite}
				setSelectedKeys={setSelectedForOverwrite}
				comparisonComponent={(value) => <>{value}</>}
			/>

			<ValidatedField<EditProjectFormState, string>
				className="mb-4"
				name={"avatarRef"}
				label={"Project Image"}
				formikConfig={formik}
				component={TaggedFileSelectionField(["Projects"], ".jpg,.png")}
			/>
			<ValidatedField<EditProjectFormState, string[]>
				name={"skillsRef"}
				formikConfig={formik}
				label={"Attributes"}
				component={SkillMultiSelect}
			/>
			<hr />
			<ValidatedField<EditProjectFormState, Milestone[]>
				className="mb-4"
				name={"milestones"}
				label={"Milestones"}
				formikConfig={formik}
				component={MilestonesField}
			/>

			<ValidatedField<EditProjectFormState, string>
				className="mb-4 flex flex-column"
				name={"comments"}
				label={"Comments"}
				required={false}
				formikConfig={formik}
				component={(renderConfig) => (
					<DefaultTextAreaComponent {...renderConfig} rows={5} />
				)}
			/>
		</Form>
	);
});
