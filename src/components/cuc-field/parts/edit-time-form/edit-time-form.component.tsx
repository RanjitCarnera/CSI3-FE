import { Form } from "@thekeytechnology/framework-react-components";
import { type FormikProps, useFormik } from "formik";
import React, { forwardRef, useImperativeHandle } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { editTimeFormSchema } from "@components/cuc-field/parts/edit-time-form/edit-time-form.consts";
import { DefaultPercentageFieldComponent } from "@components/ui/DefaultTextInput";
import { ValidatedField } from "@components/ui/ValidatedField";
import type { FormFactoryFormState, FormFactoryProps } from "@utils/form-factory";

export const EditTimeForm = forwardRef<
	FormikProps<FormFactoryFormState<typeof editTimeFormSchema>>,
	FormFactoryProps<typeof editTimeFormSchema>
>(({ initialValues, onSubmit }, ref) => {
	const form: FormikProps<FormFactoryFormState<typeof editTimeFormSchema>> = useFormik({
		validationSchema: toFormikValidationSchema(editTimeFormSchema),
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
				name={"timeInPercent"}
				formikConfig={form}
				component={DefaultPercentageFieldComponent}
			/>
		</Form>
	);
});
