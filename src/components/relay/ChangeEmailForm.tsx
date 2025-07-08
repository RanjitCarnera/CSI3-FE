import { Form } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import { useFormik } from "formik";
import { Message } from "primereact/message";
import React from "react";
import { useMutation } from "react-relay";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { type ChangeEmailForm_ChangeEmailMutation } from "../../__generated__/ChangeEmailForm_ChangeEmailMutation.graphql";
import { DefaultTextFieldComponent } from "../ui/DefaultTextInput";
import { TkButton } from "../ui/TkButton";
import { ValidatedField } from "../ui/ValidatedField";

const CHANGE_EMAIL_MUTATION = graphql`
	mutation ChangeEmailForm_ChangeEmailMutation($input: ChangeEmailInput!) {
		Auth {
			changeEmail(input: $input) {
				clientMutationId
			}
		}
	}
`;

interface FormState {
	email: string;
	email2: string;
}

export const ChangeEmailForm = () => {
	const [changeEmail, isChanging] =
		useMutation<ChangeEmailForm_ChangeEmailMutation>(CHANGE_EMAIL_MUTATION);
	const formik = useFormik<FormState>({
		initialValues: {
			email: "",
			email2: "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			email: Yup.string()
				.email("Please enter a valid e-mail address.")
				.required("E-Mail is a required field."),

			email2: Yup.string()
				.email("Please enter a valid e-mail address.")
				.oneOf([Yup.ref("email"), undefined], "E-Mails have to match."),
		}),
		onSubmit: (data, { setSubmitting, resetForm }) => {
			changeEmail({
				variables: {
					input: {
						newEmail: data.email,
					},
				},
				onCompleted: () => {
					toast.success("Your e-mail has been changed.");
					setSubmitting(false);
					resetForm({});
				},
			});
		},
	});

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<FormState, string>
				className="mb-4"
				name={"email"}
				label={"Choose your E-Mail"}
				required={true}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>
			<ValidatedField<FormState, string>
				className="mb-4"
				name={"email2"}
				label={"Repeat your E-Mail"}
				required={true}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>

			{Object.entries(formik.touched).length > 0 && (
				<Message
					className="mb-2"
					severity="info"
					content={
						"After changing your e-mail you will be logged out and have to log in again."
					}
				/>
			)}

			<TkButton
				disabled={isChanging || formik.isSubmitting}
				type="submit"
				label="Change email"
				className="p-mt-2"
			/>
		</Form>
	);
};
