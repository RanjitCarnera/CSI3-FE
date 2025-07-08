import { type DefaultFormProps, Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import { type FormikProps } from "formik/dist/types";
import React, { useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { cucFormValidation } from "@components/cuc-field/cuc-field.consts";
import { type EditAssignmentRoleFormState } from "@components/edit-assignment-role-button/parts/edit-assignment-role-form/edit-assignment-role-form.types";
import { FormCucTemplateSelect } from "@components/form/form-cuc-template-select";
import {
	DefaultNumberFieldComponent,
	DefaultPercentageFieldComponent,
	DefaultSwitchComponent,
	DefaultTextFieldComponent,
} from "@components/ui/DefaultTextInput";
import { ValidatedField } from "@components/ui/ValidatedField";
import { WithFeatureToggle } from "@components/with-feature-toggle/with-feature-toggle.component";
import { selectActiveFeatureToggleIds } from "@redux/feature-toggles";

export const EditAssignmentRoleModal = React.forwardRef<
	FormikProps<EditAssignmentRoleFormState>,
	DefaultFormProps<EditAssignmentRoleFormState>
>(({ initialState, onSubmit }, ref) => {
	const activeFeatureToggleIds = useSelector(selectActiveFeatureToggleIds);
	const isUsingCUC = activeFeatureToggleIds.includes("CUC");

	const formik = useFormik<EditAssignmentRoleFormState>({
		initialValues: initialState ?? {
			name: "",
			sortOrder: 0,
			maxNumberOfProjects: undefined,
			utilizationProjectionCapInMonths: undefined,
			countAsFullyAllocatedAtPercentage: undefined,
			countAsOverallocatedAtPercentage: undefined,
			useEndDateOfLastAssignmentOverProjectionCap: undefined,
			cucTemplate: "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			name: Yup.string().required("Name is a required field."),
			cuc: isUsingCUC ? cucFormValidation : Yup.array().notRequired(),
		}),
		onSubmit,
	});

	useImperativeHandle(ref, () => ({
		...formik,
	}));

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<EditAssignmentRoleFormState, string>
				className="mb-4"
				name={"name"}
				label={"Name"}
				required={true}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>

			<ValidatedField<EditAssignmentRoleFormState, number>
				className="mb-4"
				name={"maxNumberOfProjects"}
				label={"Maximum number of projects"}
				helpText={
					"A person with this role can be in this many projects at the same time to be 100% allocated. If left blank then default to 1 max project."
				}
				required={false}
				formikConfig={formik}
				min={1}
				step={1}
				component={DefaultNumberFieldComponent}
			/>

			<ValidatedField
				name={"useEndDateOfLastAssignmentOverProjectionCap"}
				label={"Use end date of longest assignment instead of months below"}
				formikConfig={formik}
				required={false}
				component={DefaultSwitchComponent}
			/>

			<ValidatedField<EditAssignmentRoleFormState, number>
				className="mb-4"
				name={"utilizationProjectionCapInMonths"}
				label={"Number of months for utilization projection"}
				placeholder={"Up to last assignment"}
				helpText={
					"By default utilization is calculated up to the end date of the last assignment. If you want to limit the scope of the calculation set a lower month value here "
				}
				required={false}
				formikConfig={formik}
				min={1}
				step={1}
				component={DefaultNumberFieldComponent}
			/>

			<ValidatedField<EditAssignmentRoleFormState, number>
				className="mb-4"
				name={"countAsFullyAllocatedAtPercentage"}
				label={"Utilization Percentage for full allocation"}
				placeholder={"Default: 75%"}
				iconClass="pi pi-percent"
				required={false}
				formikConfig={formik}
				component={DefaultPercentageFieldComponent}
			/>

			<ValidatedField<EditAssignmentRoleFormState, number>
				className="mb-4"
				name={"countAsOverallocatedAtPercentage"}
				label={"Utilization Percentage for overallocation"}
				placeholder={"Default: 125%"}
				iconClass="pi pi-percent"
				required={false}
				formikConfig={formik}
				component={DefaultPercentageFieldComponent}
			/>
			<WithFeatureToggle featureId={"CUC"}>
				<ValidatedField<EditAssignmentRoleFormState, string>
					name={"cucTemplate"}
					formikConfig={formik}
					label={"Cuc template"}
					placeholder={"Select a cuc template"}
					component={(renderConfig) => <FormCucTemplateSelect {...renderConfig} />} // TODO: CucTemplateSelect comp
				/>
			</WithFeatureToggle>
		</Form>
	);
});
