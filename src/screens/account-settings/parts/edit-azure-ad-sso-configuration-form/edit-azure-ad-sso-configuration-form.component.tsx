import { Button, Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import React from "react";
import { useFragment, useMutation } from "react-relay";
import { toast } from "react-toastify";
import { DefaultSwitchComponent, DefaultTextFieldComponent } from "@components/ui/DefaultTextInput";
import { ValidatedField } from "@components/ui/ValidatedField";
import { type editAzureAdSsoConfigurationForm_QueryFragment$key } from "@relay/editAzureAdSsoConfigurationForm_QueryFragment.graphql";
import {
	type AzureAdAuthProviderConfigInput,
	type editAzureAdSsoConfigurationForm_SetAzureAdSsoConfigurationMutation,
} from "@relay/editAzureAdSsoConfigurationForm_SetAzureAdSsoConfigurationMutation.graphql";
import {
	QUERY_FRAGMENT,
	SET_AZURE_AD_SSO_CONFIGURATION_MUTATION,
} from "@screens/account-settings/parts/edit-azure-ad-sso-configuration-form/edit-azure-ad-sso-configuration-form.graphql";
import { type EditAzureAdSsoConfigurationFormProps } from "@screens/account-settings/parts/edit-azure-ad-sso-configuration-form/edit-azure-ad-sso-configuration-form.types";
import { APP_NAME } from "@utils/consts";

export const EditAzureAdSsoConfigurationForm = ({
	queryFragmentRef,
}: EditAzureAdSsoConfigurationFormProps) => {
	const queryFragment = useFragment<editAzureAdSsoConfigurationForm_QueryFragment$key>(
		QUERY_FRAGMENT,
		queryFragmentRef,
	);
	const [set, isSetting] =
		useMutation<editAzureAdSsoConfigurationForm_SetAzureAdSsoConfigurationMutation>(
			SET_AZURE_AD_SSO_CONFIGURATION_MUTATION,
		);
	const configs = queryFragment.Viewer.Auth.currentAccount?.extensions.find(
		(e) => e.kind === "AuthProvider",
	)?.authProviders;
	const config = configs?.find((c) => c.kind === "AzureAd");
	const formik = useFormik<AzureAdAuthProviderConfigInput>({
		initialValues: {
			tenantId: config?.tenantId ?? "",
			applicationId: config?.applicationId ?? "",
			domain: config?.domain ?? "",
			authorityUrl: config?.authorityUrl ?? "",
			secret: config?.secret ?? "",
			isActivated: config?.isActivated ?? false,
		},
		onSubmit: (values) => {
			set({
				variables: {
					input: {
						azureAdAuthProvider: {
							isActivated: values.isActivated,
							tenantId: values.tenantId,
							applicationId: values.applicationId,
							domain: values.domain,
							secret: values.secret,
							authorityUrl: values.authorityUrl,
						},
					},
				},
				onCompleted: () => {
					toast.success("Azure AD Sso Configuration updated successfully.");
					formik.setSubmitting(false);
				},
			});
		},
	});
	const redirectUrl = "https://app.constructionintelligence.com/redirect";
	return (
		<Form onSubmit={formik.handleSubmit}>
			<span>
				Configure Azure AD SSO on {APP_NAME}. To acquire the requested information, you need
				to register an application on microsoft azure first. Within the registered
				application, you will find the applicationId. Within the application, you have to
				set the redirectUrl to "{redirectUrl}". The domain specifying the part in common for
				all users of the tenant. For example "your-domain" being the domain in your email:
				"test@your-domain.com". And your tenantId being the id of your AD (Active Directory)
				where all your users are located.
			</span>
			<ValidatedField<AzureAdAuthProviderConfigInput, string>
				name={"tenantId"}
				label={"Tenant Id"}
				required={false}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>
			<ValidatedField<AzureAdAuthProviderConfigInput, string>
				name={"applicationId"}
				label={"Application Id"}
				required
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>
			<ValidatedField<AzureAdAuthProviderConfigInput, string>
				name={"authorityUrl"}
				label={"Authority Url"}
				required
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>
			<ValidatedField<AzureAdAuthProviderConfigInput, string>
				name={"secret"}
				label={"Secret"}
				required
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>
			<ValidatedField<AzureAdAuthProviderConfigInput, string>
				name={"domain"}
				label={"Domain"}
				required
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>
			<ValidatedField<AzureAdAuthProviderConfigInput, boolean>
				name={"isActivated"}
				label={"Is Activated"}
				required
				formikConfig={formik}
				component={DefaultSwitchComponent}
			/>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "0.5rem",
				}}
			>
				<div style={{ flex: 1 }}>
					<Button
						disabled={isSetting || formik.isSubmitting}
						onClick={() => {
							formik.handleSubmit();
						}}
						content={{ label: "Save Azure AD Sso Config" }}
					/>
				</div>
				<div style={{ flexGrow: 0, flexShrink: 1 }}>
					<Button
						disabled={isSetting || formik.isSubmitting}
						onClick={() => {
							set({
								variables: {
									input: {
										azureAdAuthProvider: undefined,
									},
								},
								onCompleted: () => {
									toast.warning("Cleared Azure AD Sso Configuration.");
								},
							});
						}}
						content={{ label: "Clear" }}
					/>
				</div>
			</div>
		</Form>
	);
};
