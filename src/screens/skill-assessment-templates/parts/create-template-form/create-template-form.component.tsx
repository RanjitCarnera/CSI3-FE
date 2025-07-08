import {
	type DefaultFormProps,
	DefaultTextFieldComponent,
	Form,
	ValidatedField,
} from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import { type FormikProps } from "formik/dist/types";
import { MultiSelect } from "primereact/multiselect";
import React, { useImperativeHandle } from "react";
import * as Yup from "yup";
import { AssignmentRolesSelect } from "@components/relay/AssignmentRolesSelect";
import { SkillMultiSelectV2 } from "@components/relay/skill-multi-select-v2";
import { DefaultStringArrayField } from "@components/ui/DefaultTextInput";
import { textSubtle } from "@screens/skill-assessment/parts/mock/color";
import { PSpan } from "@screens/skill-assessment/parts/mock/typography";
import { JobTitlesWrapper } from "@screens/skill-assessment-templates/parts/create-template-form/create-template-form.styles";
import {
	type CreateTemplateFormState,
	type RoleOption,
} from "@screens/skill-assessment-templates/parts/create-template-form/create-template-form.types";

export const CreateTemplateForm = React.forwardRef<
	FormikProps<CreateTemplateFormState>,
	DefaultFormProps<CreateTemplateFormState>
>(({ initialState, onSubmit }, ref) => {
	const formik = useFormik<CreateTemplateFormState>({
		initialValues: initialState ?? {
			jobTitles: [],
			name: "",
			skills: [],
			distributionListEmails: [],
			distributionListRole: [],
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			jobTitles: Yup.array().min(1).required("min 1 is required."),
			name: Yup.string().required("Name is required."),
			skills: Yup.array().min(1).required("min 1 is required"),
			distributionListEmails: Yup.array()
				.transform(function (value, originalValue) {
					if (this.isType(value) && value !== null) {
						return value;
					}
					return originalValue ? originalValue.split(/[\s,]+/) : [];
				})
				.of(Yup.string().email(({ value }) => `${value} is not a valid email`)),
		}),
		onSubmit,
	});

	useImperativeHandle(ref, () => ({
		...formik,
	}));

	const roleOptions: RoleOption[] = [
		{ label: "Assessed Person", value: "AssessedPerson" },
		{ label: "Supervisor", value: "Supervisor" },
		{ label: "Admin", value: "Admin" },
	];

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<CreateTemplateFormState, string>
				name={"name"}
				label={"ASSESSMENT NAME"}
				placeholder="Enter..."
				component={DefaultTextFieldComponent}
				formikConfig={formik}
			/>
			<JobTitlesWrapper>
				<ValidatedField<CreateTemplateFormState, string[]>
					name={"jobTitles"}
					label={"JOB TITLES"}
					placeholder="Select..."
					component={(fieldConfig) => (
						<AssignmentRolesSelect
							fieldName="assignment-roles-filter"
							fieldValue={fieldConfig.fieldValue}
							placeholder={"Filter by assignment roles"}
							updateField={(e) => {
								fieldConfig.updateField(e ?? []);
							}}
						/>
					)}
					formikConfig={formik}
				/>
				<PSpan color={textSubtle}>
					Optional. These will be autosuggested for when these job titles are selected.
					The assessment can also be manually selected.
				</PSpan>
			</JobTitlesWrapper>

			<ValidatedField<CreateTemplateFormState, string[]>
				name={"skills"}
				formikConfig={formik}
				component={(renderConfig) => {
					return (
						<SkillMultiSelectV2
							fieldValue={renderConfig.fieldValue}
							updateField={(e) => {
								renderConfig.updateField(e ?? []);
							}}
							placeholder={"Select Attributes"}
						/>
					);
				}}
			/>
			<label htmlFor="">Distribution List</label>
			<ValidatedField<CreateTemplateFormState, RoleOption[]>
				name={"distributionListRole"}
				label={"Roles"}
				required={false}
				formikConfig={formik}
				component={(renderConfig) => (
					<MultiSelect
						value={renderConfig.fieldValue}
						options={roleOptions}
						onChange={(e) => {
							renderConfig.updateField(e.value);
						}}
						placeholder={"Select Roles"}
					/>
				)}
			/>
			<ValidatedField<CreateTemplateFormState, string[]>
				name={"distributionListEmails"}
				label={"Emails"}
				required={false}
				formikConfig={formik}
				component={(renderConfig) => <DefaultStringArrayField {...renderConfig} step={1} />}
			/>
		</Form>
	);
});
