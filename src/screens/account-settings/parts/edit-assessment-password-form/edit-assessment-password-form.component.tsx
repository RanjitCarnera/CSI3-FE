import { Form, InputPassword } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import React from "react";
import { useFragment, useMutation } from "react-relay";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { TkButton } from "@components/ui/TkButton";
import { ValidatedField } from "@components/ui/ValidatedField";
import { type editAssessmentPasswordForm_QueryFragment$key } from "@relay/editAssessmentPasswordForm_QueryFragment.graphql";
import { type editAssessmentPasswordForm_SetAccountAssessmentPasswordMutation } from "@relay/editAssessmentPasswordForm_SetAccountAssessmentPasswordMutation.graphql";
import {
	QUERY_FRAGMENT,
	SET_PASSWORD_MUTATION,
} from "@screens/account-settings/parts/edit-assessment-password-form/edit-assessment-password-form.graphql";
import {
	type EditAssessmentPasswordFormProps,
	type EditAssessmentPasswordFormState,
} from "@screens/account-settings/parts/edit-assessment-password-form/edit-assessment-password-form.types";

export const EditAssessmentPasswordForm = ({ queryFragment }: EditAssessmentPasswordFormProps) => {
	const query = useFragment<editAssessmentPasswordForm_QueryFragment$key>(
		QUERY_FRAGMENT,
		queryFragment,
	);
	const [edit, isEditing] =
		useMutation<editAssessmentPasswordForm_SetAccountAssessmentPasswordMutation>(
			SET_PASSWORD_MUTATION,
		);

	const password =
		query.Viewer.Auth.currentAccount?.extensions.find((e) => e.kind === "Assessment")
			?.password ?? "";
	const initialState: EditAssessmentPasswordFormState = {
		assessmentPassword: password,
	};
	const formik = useFormik<EditAssessmentPasswordFormState>({
		initialValues: initialState || {
			accountPassword: "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			assessmentPassword: Yup.string()
				.required("No password provided.")
				.min(8, "Password is too short - should be 8 chars minimum.")
				.matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
		}),
		onSubmit: (values) => {
			edit({
				variables: {
					input: {
						password: values.assessmentPassword,
					},
				},
				onCompleted: () => {
					toast.success("Set Assessment Password.");
				},
			});
		},
	});

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<EditAssessmentPasswordFormState, string>
				name={"assessmentPassword"}
				label={"Name"}
				required={true}
				formikConfig={formik}
				component={(config) => (
					<InputPassword
						{...config}
						value={config.fieldValue}
						onValueChange={config.updateField}
						toggleMask={true}
					/>
				)}
			/>
			<TkButton
				disabled={isEditing || formik.isSubmitting}
				type="submit"
				label={"Set Assessment Password"}
				className="p-mt-2"
			/>
		</Form>
	);
};
