import { useMutation } from "react-relay";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { ValidatedField } from "../../ui/ValidatedField";
import { DefaultTextFieldComponent } from "../../ui/DefaultTextInput";
import React from "react";
import { changeNameForm_ChangeNameMutation } from "../../../__generated__/changeNameForm_ChangeNameMutation.graphql";
import { TkButton } from "../../ui/TkButton";
import { ChangeNameFormState } from "./change-name-form.interface";
import { CHANGE_NAME_MUTATION } from "./change-name-form.graphql";
import { NAME_VALIDATION_SCHEMA } from "../../ui/registration-form/registration-form.const";
import { Form } from "@thekeytechnology/framework-react-components";

export const ChangeNameForm = () => {
	const [changeName, isChanging] =
		useMutation<changeNameForm_ChangeNameMutation>(CHANGE_NAME_MUTATION);

	const formik = useFormik<ChangeNameFormState>({
		initialValues: {
			name: "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			name: NAME_VALIDATION_SCHEMA,
		}),
		onSubmit: (data, { setSubmitting, resetForm }) => {
			changeName({
				variables: {
					input: {
						newName: data.name,
					},
				},
				onCompleted: () => {
					toast.success("Your name has been changed.");
					setSubmitting(false);
					resetForm({});
				},
			});
		},
	});

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<ChangeNameFormState, string>
				className="mb-4"
				name={"name"}
				label={"Edit your name"}
				required={true}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>
			<TkButton
				disabled={isChanging || formik.isSubmitting}
				type="submit"
				label="Change name"
				className="p-mt-2"
			/>
		</Form>
	);
};
