import { Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import React from "react";
import { useFragment, useMutation } from "react-relay";
import * as Yup from "yup";
import { DefaultSwitchComponent } from "@components/ui/DefaultTextInput";
import { TkButton } from "@components/ui/TkButton";
import { ValidatedField } from "@components/ui/ValidatedField";
import { type editAccountSettingsForm_QueryFragment$key } from "@relay/editAccountSettingsForm_QueryFragment.graphql";
import { type editAccountSettingsForm_SetAccountSettingsMutation } from "@relay/editAccountSettingsForm_SetAccountSettingsMutation.graphql";
import {
	QUERY_FRAGMENT,
	SET_ACCOUNT_SETTINGS_MUTATION,
} from "@screens/account-settings/parts/edit-account-settings-form/edit-account-settings-form.graphql";
import {
	type EditAccountSettingsFormProps,
	type EditAccountSettingsFormState,
} from "@screens/account-settings/parts/edit-account-settings-form/edit-account-settings-form.types";

export const EditAccountSettingsFormComponent = ({
	queryFragment,
}: EditAccountSettingsFormProps) => {
	const query = useFragment<editAccountSettingsForm_QueryFragment$key>(
		QUERY_FRAGMENT,
		queryFragment,
	);
	const [edit, isEditing] = useMutation<editAccountSettingsForm_SetAccountSettingsMutation>(
		SET_ACCOUNT_SETTINGS_MUTATION,
	);

	const twoFAExtension = query.Viewer.Auth.currentAccount?.extensions.find(
		(e) => e.kind === "TwoFA",
	);
	const initialState: EditAccountSettingsFormState = {
		force2FA: twoFAExtension?.force2FA ?? false,
	};
	const formik = useFormik<EditAccountSettingsFormState>({
		initialValues: initialState,
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			force2FA: Yup.boolean().required(),
		}),
		onSubmit: (values, formikHelpers) => {
			edit({
				variables: {
					input: {
						force2FA: values.force2FA,
					},
				},
				onCompleted: () => {},
			});
		},
	});

	return (
		<Form onSubmit={formik.handleSubmit}>
			<span>
				Forcing 2FA for all account members will force all users to setup 2FA. Once
				disabled, all users need to disable 2FA manually if they so wish. Disabling 2FA on a
				user basis will force the user to re-setup 2FA on next login.
			</span>
			<ValidatedField<EditAccountSettingsFormState, boolean>
				name={"force2FA"}
				label={"Force 2FA"}
				required={true}
				formikConfig={formik}
				component={DefaultSwitchComponent}
			/>
			<TkButton
				disabled={isEditing || formik.isSubmitting}
				type="submit"
				label={"Set 2FA Settings"}
				className="p-mt-2"
			/>
		</Form>
	);
};
