import { Form } from "@thekeytechnology/framework-react-components";
import { type FormikProps, useFormik } from "formik";
import React, { forwardRef, useImperativeHandle } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { editWeightFormSchema } from "@components/cuc-field/parts/edit-weight-form/edit-weight-form.consts";
import { DefaultPercentageFieldComponent } from "@components/ui/DefaultTextInput";
import { ValidatedField } from "@components/ui/ValidatedField";
import type { FormFactoryFormState, FormFactoryProps } from "@utils/form-factory";

export const EditWeightForm = forwardRef<
	FormikProps<FormFactoryFormState<typeof editWeightFormSchema>>,
	FormFactoryProps<typeof editWeightFormSchema>
>(({ initialValues, onSubmit }, ref) => {
	const form: FormikProps<FormFactoryFormState<typeof editWeightFormSchema>> = useFormik({
		validationSchema: toFormikValidationSchema(editWeightFormSchema),
		initialValues,
		onSubmit: (values) => {
			void onSubmit(values);
		},
	});

	useImperativeHandle(ref, () => form);
	return (
		<Form
			onSubmit={(e) => {
				form.handleSubmit(e);
			}}
		>
			<ValidatedField
				name={"weightInPercent"}
				formikConfig={form}
				component={DefaultPercentageFieldComponent}
			/>
		</Form>
	);
});
