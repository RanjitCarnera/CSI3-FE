import { type DefaultFormProps, Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import type { FormikProps } from "formik/dist/types";
import React, { useImperativeHandle } from "react";
import * as Yup from "yup";
import { DefaultColorPickerComponent } from "@components/relay/default-color-picker";
import { DefaultTextFieldComponent } from "@components/ui/DefaultTextInput";
import { ValidatedField } from "@components/ui/ValidatedField";
import { type EditTagFormState } from "@screens/tags/parts/edit-tag-button/parts/edit-tag-form/edit-tag-form.types";

export const EditTagForm = React.forwardRef<
	FormikProps<EditTagFormState>,
	DefaultFormProps<EditTagFormState>
>(({ initialState, onSubmit }, ref) => {
	const formik = useFormik<EditTagFormState>({
		initialValues: initialState ?? {
			name: "",
			color: "",
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
			<ValidatedField<EditTagFormState, string>
				className="mb-4"
				name={"name"}
				label={"Name"}
				required={true}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>
			<ValidatedField<EditTagFormState, string>
				className="mb-4"
				name={"color"}
				label={"Color"}
				required={true}
				formikConfig={formik}
				component={DefaultColorPickerComponent}
			/>
		</Form>
	);
});
