import { graphql } from "babel-plugin-relay/macro";
import { useFormik } from "formik";
import * as Yup from "yup";
import { logout } from "../../redux/AuthSlice";
import { ValidatedField } from "../ui/ValidatedField";
import { TkButton } from "../ui/TkButton";
import React from "react";
import { useMutation } from "react-relay";
import { useDispatch } from "react-redux";
import { ChangePasswordForm_ChangePasswordMutation } from "../../__generated__/ChangePasswordForm_ChangePasswordMutation.graphql";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { toast } from "react-toastify";
import { Form } from "@thekeytechnology/framework-react-components";

const CHANGE_PASSWORD_MUTATION = graphql`
	mutation ChangePasswordForm_ChangePasswordMutation($input: ChangePasswordInput!) {
		Auth {
			changePassword(input: $input) {
				clientMutationId
			}
		}
	}
`;

interface FormState {
	password: string;
	password2: string;
}

export const ChangePasswordForm = () => {
	const dispatch = useDispatch();
	const [changePassword, isChanging] =
		useMutation<ChangePasswordForm_ChangePasswordMutation>(CHANGE_PASSWORD_MUTATION);

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
		onSubmit: (data, { setSubmitting, resetForm }) => {
			changePassword({
				variables: {
					input: {
						newPassword: data.password,
					},
				},
				onCompleted: () => {
					toast.success(
						"Your password has been changed. You will be logged out. Use your new password to log in.",
					);
					setSubmitting(false);
					resetForm({});
					setTimeout(() => {
						dispatch(logout());
					}, 2000);
				},
			});
		},
	});

	return (
		<Form onSubmit={formik.handleSubmit}>
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
				disabled={isChanging || formik.isSubmitting}
				type="submit"
				label="Change password"
				className="p-mt-2"
			/>
		</Form>
	);
};
