const MILESTONE_TEMPLATE_MESSAGES = {
	milestonetemplate_cannot_edit_milestone_template_data:
		"Could not edit milestone template. Most likely the name is already taken.",
	milestonetemplate_invalid_milestone_template_name:
		"Could not create new milestone template. That name is already taken.",
};

const AZURE_AD_MESSAGES = {
	authazuread_cannot_change_email: "An Azure Ad user cannot change email.",
	authazuread_cannot_change_password: "An Azure Ad user cannot change password.",
	authazuread_cannot_forgot_password: "Please forget use Azure Ad to reset your password.",
	authazuread_cannot_register_user: "You cannot register an Azure Ad user.",
	authazuread_azure_ad_unknown_exception:
		"Something went wrong during the setup or login with Azure Ad. Please contact your administrator.",
	authazuread_azure_ad_user_not_invited: "This email address has not been invited.",
};
const AUTH_MESSAGES = {
	auth_authenticate_unspecified_auth: "Login failed, please check your username and password.",
	auth_password_invalid: "Password was invalid.",
	auth_user_already_activated: "This user is already activated.",
	auth_cant_delete_only_owner_exception: "Can't delete only owner.",
	auth_user_not_activated_exception:
		"Your account is not activated. Check your email and follow the activation link.",
	auth_already_registered_exception: "There is already an account with this e-mail address.",
	auth_already_in_account_exception: "You are already a member of this account.",
	auth_login_with_email_and_password_unspecified_auth: "Please check your email and password.",
	auth_cannot_perform_action_as_azure_ad_user: "Cannot perform this action as Azure AD user.",
	auth_forgot_password_unspecified_auth: "User not found.",
	auth_azure_ad_user_cannot_login_with_email_and_password:
		"Cannot perform this action as Azure AD user.",
};

const MANAGEMENT_MESSAGES = {
	management_already_invited_exception: "This email address has already been invited.",
};

const SCENARIO_MESSAGES = {
	scenario_cant_add_projects_multiple_times: "Cannot add project multiple times to a scenario.",
};

const TWO_FACTOR_AUTH_MESSAGES = {
	tokens_cannot_generate_recovery_codes: "Cannot generate recovery codes, when 2fa not enabled.",
	tokens_wrong_recovery_code: "Recovery code is either wrong or has been used.",
	tokens_two_factor_authentication_incorrect: "Wrong 2FA code.",
};
const ASSESSMENT_MESSAGES = {
	auth_invalid_assessment_password: "Please close the tab and try again.",
};

export const ERROR_MESSAGES: Record<string, string> = {
	rand_project_identifier_already_exists_on_non_rand_project:
		"Project Identifier already exists on a project. Sync manually.",
	project_project_with_same_identifier_already_exists:
		"A project with an identical project identifier already exists.",
	...AUTH_MESSAGES,
	...TWO_FACTOR_AUTH_MESSAGES,
	...ASSESSMENT_MESSAGES,
	...SCENARIO_MESSAGES,
	...AZURE_AD_MESSAGES,
	...MANAGEMENT_MESSAGES,
	...MILESTONE_TEMPLATE_MESSAGES,
};
