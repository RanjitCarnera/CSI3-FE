import { type DefaultFormProps, Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import type { FormikProps } from "formik/dist/types";
import React, { useImperativeHandle } from "react";
import * as Yup from "yup";
import { DefaultTextFieldComponent } from "@components/ui/DefaultTextInput";
import { ValidatedField } from "@components/ui/ValidatedField";
import { type CreateTagFormState } from "@screens/tags/parts/create-tag-button/create-tag-button.types";

export const CreateTagForm = React.forwardRef<
	FormikProps<CreateTagFormState>,
	DefaultFormProps<CreateTagFormState>
>(({ initialState, onSubmit }, ref) => {
	const formik = useFormik<CreateTagFormState>({
		initialValues: initialState ?? {
			name: "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			name: Yup.string().required("Name is a required field."),
		}),
		onSubmit,
	});

	useImperativeHandle(ref, () => ({
		...formik,
	}));

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<CreateTagFormState, string>
				className="mb-4"
				name={"name"}
				label={"Name"}
				required={true}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>
		</Form>
	);
});
