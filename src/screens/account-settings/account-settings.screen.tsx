import { useLazyLoadQuery } from "react-relay";
import { type accountSettingsScreen_Query } from "@relay/accountSettingsScreen_Query.graphql";
import { QUERY } from "@screens/account-settings/account-settings.graphql";
import { FormWrapper } from "@screens/account-settings/account-settings.styles";
import { EditAccountSettingsFormComponent } from "@screens/account-settings/parts/edit-account-settings-form";
import { EditAssessmentPasswordForm } from "@screens/account-settings/parts/edit-assessment-password-form";
import { EditAzureAdSsoConfigurationForm } from "@screens/account-settings/parts/edit-azure-ad-sso-configuration-form";
import { EditNumericalDimensionExplanationsForm } from "@screens/account-settings/parts/edit-numerical-dimension-explanations-form";
import { ChangeLogoForm } from "../../components/relay/ChangeLogoForm";
import { BaseSettingsScreen } from "../../components/ui/BaseSettingsScreen";
import { TkCard } from "../../components/ui/TkCard";

export const AccountSettingsScreen = () => {
	const query = useLazyLoadQuery<accountSettingsScreen_Query>(QUERY, {});

	const hasAzureAdPermission = true; // TODO: account permission
	return (
		<BaseSettingsScreen>
			<TkCard
				header={
					<div className="flex p-3 align-items-center card-flat">
						<h1 className="mt-0 mr-3 mb-0 ml-0">Account settings</h1>
					</div>
				}
			>
				<h3>Change Logo</h3>
				<FormWrapper>
					<ChangeLogoForm queryFragmentRef={query} />
				</FormWrapper>
				<h3>Numerical Attribute Default Explanations</h3>
				<FormWrapper>
					<EditNumericalDimensionExplanationsForm queryFragment={query} />
				</FormWrapper>
				<h3>Assessment Landing Page Password</h3>
				<FormWrapper>
					<EditAssessmentPasswordForm queryFragment={query} />
				</FormWrapper>
				<h3>2FA Settings</h3>
				<FormWrapper>
					<EditAccountSettingsFormComponent queryFragment={query} />
				</FormWrapper>
				{hasAzureAdPermission && (
					<>
						<h3>Azure Ad SSO Setup</h3>
						<FormWrapper>
							<EditAzureAdSsoConfigurationForm queryFragmentRef={query} />
						</FormWrapper>
					</>
				)}
			</TkCard>
		</BaseSettingsScreen>
	);
};
