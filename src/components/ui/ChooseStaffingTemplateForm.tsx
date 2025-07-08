import { FormikHelpers, useFormik } from "formik";
import React, { useImperativeHandle } from "react";
import { FormikProps } from "formik/dist/types";
import * as Yup from "yup";
import { ValidatedField } from "./ValidatedField";
import { StaffingTemplateSelect } from "../relay/StaffingTemplateSelect";
import { Form } from "@thekeytechnology/framework-react-components";

export interface ChooseStaffingTemplateFormState {
	staffingTemplateId?: string;
}

interface OwnProps {
	initialState?: ChooseStaffingTemplateFormState;
	onSubmit: (
		values: ChooseStaffingTemplateFormState,
		formikHelpers: FormikHelpers<ChooseStaffingTemplateFormState>,
	) => void;
}

export const ChooseStaffingTemplateForm = React.forwardRef<
	FormikProps<ChooseStaffingTemplateFormState>,
	OwnProps
>(({ initialState, onSubmit }, ref) => {
	const formik = useFormik<ChooseStaffingTemplateFormState>({
		initialValues: {
			staffingTemplateId: undefined,
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			staffingTemplateId: Yup.string().required("Staffing template is a required field."),
		}),
		onSubmit: onSubmit,
	});

	useImperativeHandle(ref, () => ({
		...formik,
	}));

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<ChooseStaffingTemplateFormState, string>
				className="mb-4"
				name={"staffingTemplateId"}
				label={"Staffing template"}
				required={true}
				placeholder={"Choose template"}
				formikConfig={formik}
				component={StaffingTemplateSelect}
			/>
		</Form>
	);
});
