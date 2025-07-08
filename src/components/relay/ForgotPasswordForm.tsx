import graphql from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ValidatedField } from "../ui/ValidatedField";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { TkButton } from "../ui/TkButton";
import { NavLink } from "react-router-dom";
import { TkButtonLink } from "../ui/TkButtonLink";
import React, { useState } from "react";
import { ForgotPasswordForm_ForgotPasswordMutation } from "../../__generated__/ForgotPasswordForm_ForgotPasswordMutation.graphql";
import { TkMessage } from "../ui/TkMessage";
import { Form } from "@thekeytechnology/framework-react-components";

const LOGIN_MUTATION = graphql`
	mutation ForgotPasswordForm_ForgotPasswordMutation($input: ForgotPasswordInput!) {
		Auth {
			forgotPassword(input: $input) {
				clientMutationId
			}
		}
	}
`;

interface FormState {
	email: string;
}

export const ForgotPasswordForm = () => {
	const [forgotPassword, isLoggingIn] =
		useMutation<ForgotPasswordForm_ForgotPasswordMutation>(LOGIN_MUTATION);
	const [emailSent, setEmailSent] = useState(false);

	const formik = useFormik<FormState>({
		initialValues: {
			email: "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			email: Yup.string()
				.email("Please enter a valid e-mail address.")
				.required("E-Mail is a required field."),
		}),
		onSubmit: (data, { resetForm }) => {
			forgotPassword({
				variables: {
					input: {
						email: data.email,
					},
				},
				onCompleted: (response) => {
					if (response.Auth.forgotPassword) {
						setEmailSent(true);
						resetForm({});
					}
				},
			});
		},
	});

	return emailSent ? (
		<TkMessage
			content={
				"If an account is associated with this e-mail address, We've sent you an e-mail to reset your password!."
			}
		/>
	) : (
		<Form onSubmit={formik.handleSubmit} className={"px-6 mb-6"}>
			<ValidatedField<FormState, string>
				className="mb-4"
				name={"email"}
				label={"E-Mail"}
				required={true}
				formikConfig={formik}
				component={({ fieldValue, updateField, fieldName, isValid }) => {
					return (
						<InputText
							id={fieldName}
							name={fieldName}
							value={fieldValue}
							onChange={(e) => updateField(e.target.value)}
							className={classNames({ "p-invalid": !isValid })}
						/>
					);
				}}
			/>
			<TkButton
				disabled={isLoggingIn}
				type="submit"
				label="Send password reset email"
				className="p-mt-2"
			/>

			<div className="mt-5">
				<NavLink to={"/login"}>
					<TkButtonLink label={"No wait, I remembered..."} />
				</NavLink>
			</div>
		</Form>
	);
};
