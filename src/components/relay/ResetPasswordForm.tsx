import graphql from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ValidatedField } from "../ui/ValidatedField";
import { classNames } from "primereact/utils";
import { TkButton } from "../ui/TkButton";
import { NavLink } from "react-router-dom";
import { TkButtonLink } from "../ui/TkButtonLink";
import React, { useState } from "react";
import { ResetPasswordForm_ResetPasswordMutation } from "../../__generated__/ResetPasswordForm_ResetPasswordMutation.graphql";
import { TkMessage } from "../ui/TkMessage";
import { Password } from "primereact/password";
import { Form } from "@thekeytechnology/framework-react-components";

const LOGIN_MUTATION = graphql`
	mutation ResetPasswordForm_ResetPasswordMutation($input: ResetPasswordInput!) {
		Auth {
			resetPassword(input: $input) {
				clientMutationId
			}
		}
	}
`;

interface FormState {
	password: string;
	password2: string;
}

interface OwnProps {
	token: string;
}

export const ResetPasswordForm = ({ token }: OwnProps) => {
	const [resetPassword, isResetting] =
		useMutation<ResetPasswordForm_ResetPasswordMutation>(LOGIN_MUTATION);
	const [passwordReset, setPasswordReset] = useState(false);

	const formik = useFormik<FormState>({
		initialValues: {
			password: "",
			password2: "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			password: Yup.string()
				.min(8, "A password needs at least 8 characters.")
				.required("Password is a required field."),
			password2: Yup.string().oneOf(
				[Yup.ref("password"), undefined],
				"Passwords have to match.",
			),
		}),
		onSubmit: (data) => {
			resetPassword({
				variables: {
					input: {
						token: token,
						newPassword: data.password!,
					},
				},
				onCompleted: (response) => {
					if (response.Auth.resetPassword) {
						setPasswordReset(true);
					}
				},
			});
		},
	});

	return passwordReset ? (
		<TkMessage
			className="w-12"
			content={
				<div>
					<div>Your password was reset! Try logging in now.</div>
					<div className="mt-3 flex justify-content-center">
						<NavLink to={"/"}>
							<TkButtonLink label={"To login..."} />
						</NavLink>
					</div>
				</div>
			}
		/>
	) : (
		<Form onSubmit={formik.handleSubmit} className={"px-6 mb-6"}>
			<ValidatedField<FormState, string>
				className="mb-4"
				name={"password"}
				label={"Choose a password (min 8 characters)"}
				required={true}
				formikConfig={formik}
				component={({ fieldValue, updateField, fieldName, isValid }) => {
					return (
						<Password
							id={fieldName}
							name={fieldName}
							value={fieldValue}
							onChange={(e) => updateField(e.target.value)}
							toggleMask
							feedback={false}
							className={classNames({ "p-invalid": !isValid })}
						/>
					);
				}}
			/>

			<ValidatedField<FormState, string>
				className="mb-6"
				name={"password2"}
				label={"Repeat your password"}
				required={true}
				formikConfig={formik}
				component={({ fieldValue, updateField, fieldName, isValid }) => {
					return (
						<Password
							id={fieldName}
							name={fieldName}
							value={fieldValue}
							onChange={(e) => updateField(e.target.value)}
							toggleMask
							feedback={false}
							className={classNames({ "p-invalid": !isValid })}
						/>
					);
				}}
			/>
			<TkButton
				disabled={isResetting}
				type="submit"
				label="Reset password"
				className="p-mt-2"
			/>

			<div className="mt-5">
				<NavLink to={"/"}>
					<TkButtonLink label={"No wait, I remembered..."} />
				</NavLink>
			</div>
		</Form>
	);
};
