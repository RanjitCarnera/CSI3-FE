import { Form } from "@thekeytechnology/framework-react-components";
import { type FormikProps, useFormik } from "formik";
import React, { forwardRef, useImperativeHandle } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { DefaultTextFieldComponent } from "@components/ui/DefaultTextInput";
import { ValidatedField } from "@components/ui/ValidatedField";
import { type FormFactoryFormState, type FormFactoryProps } from "@utils/form-factory";
import { editNameFormSchema } from "./edit-name-form.consts";

export const EditNameForm = forwardRef<
	FormikProps<FormFactoryFormState<typeof editNameFormSchema>>,
	FormFactoryProps<typeof editNameFormSchema>
>(({ initialValues, onSubmit }, ref) => {
	const form: FormikProps<FormFactoryFormState<typeof editNameFormSchema>> = useFormik({
		validationSchema: toFormikValidationSchema(editNameFormSchema),
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
				name={"name"}
				formikConfig={form}
				component={DefaultTextFieldComponent}
			/>
		</Form>
	);
});
