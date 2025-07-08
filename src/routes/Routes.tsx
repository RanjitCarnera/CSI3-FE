import React from "react";
import {
	ACCEPT_INVITATION_PATH,
	AcceptInvitationScreen,
} from "@screens/accept-invitation/AcceptInvitationScreen";
import { AccessScreen } from "@screens/access/AccessScreen";
import { AccountSettingsScreen } from "@screens/account-settings";
import { AccountsAdminScreen } from "@screens/accounts-admin/AccountsAdminScreen";
import { ActivateScreen, ACTIVATION_PATH } from "@screens/activate/ActivateScreen";
import { Activate2FAScreen, ACTIVATE_2FA_SCREEN } from "@screens/activate-2fa";
import { AssignmentRolesScreen } from "@screens/assignment-roles";
import {
	AVAILABILITY_FORECAST_SCREEN_ROUTE,
	AvailabilityForecastScreen,
} from "@screens/availability-forecast";
import { DivisionsScreen } from "@screens/divisions";
import { EditEmailTemplateScreen } from "@screens/edit-email-template/EditEmailTemplateScreen";
import { EmailTemplatesScreen } from "@screens/email-templates";
import { ForgotPasswordScreen } from "@screens/forgot-password/ForgotPasswordScreen";
import { GroupsScreen } from "@screens/groups/GroupsScreen";
import { LoginScreen } from "@screens/login/LoginScreen";
import { LoginAzureAdDisclaimer } from "@screens/login-azure-ad-disclaimer";
import { LoginAzureAdRedirect } from "@screens/login-azure-ad-redirect";
import {
	SCENARIO_MAP_VIEW_SCREEN_ROUTE,
	ScenarioMapViewScreen,
} from "@screens/map-view/ScenarioMapViewScreen";
import { PeopleScreen } from "@screens/people";
import { PERSONAL_DATA_SCREEN_PATH, PersonalDataScreen } from "@screens/personal-data";
import { ProjectStagesScreen } from "@screens/project-stages";
import {
	SCENARIO_PROJECT_VIEW_SCREEN_ROUTE,
	ScenarioProjectViewScreen,
} from "@screens/project-view/ScenarioProjectViewScreen";
import { ProjectsScreen } from "@screens/projects";
import {
	RECOVERY_CODES_SCREEN_PATH,
	RecoveryCodesScreen,
} from "@screens/recovery-codes/recovery-codes.screen";
import { RegionsScreen } from "@screens/regions";
import { RegistrationScreen } from "@screens/registration/RegistrationScreen";
import { ResetScreen } from "@screens/reset/ResetScreen";
import {
	RESET_PASSWORD_PATH,
	ResetPasswordScreen,
} from "@screens/reset-password/ResetPasswordScreen";
import { ScenariosScreen } from "@screens/scenarios";
import { SkillAssessmentWithAuth } from "@screens/skill-assessment";
import { SKILL_ASSESSMENT_PATH } from "@screens/skill-assessment/skill-assessment.consts";
import { SkillAssessmentExecutionWithAuth } from "@screens/skill-assessment-execution";
import { SKILL_ASSESSMENT_EXECUTION_PATH } from "@screens/skill-assessment-execution/skill-assessment-execution.consts";
import { SkillAssessmentSuccessWithAuth } from "@screens/skill-assessment-success";
import { SKILL_ASSESSMENT_SUCCESS_PATH } from "@screens/skill-assessment-success/skill-assessment-success.consts";
import { SkillAssessmentTemplates } from "@screens/skill-assessment-templates";
import { SKILL_ASSESSMENT_TEMPLATES_PATH } from "@screens/skill-assessment-templates/skill-assessment-templates.consts";
import { SkillAssessments } from "@screens/skill-assessments";
import { SKILL_ASSESSMENTS_PATH } from "@screens/skill-assessments/skill-assessments.consts";
import { SkillsScreen } from "@screens/skill-categories";
import {
	SCENARIO_STAFF_VIEW_SCREEN_ROUTE,
	ScenarioStaffViewScreen,
} from "@screens/staff-view/ScenarioStaffViewScreen";
import { StaffingTemplatesScreen } from "@screens/staffing-templates";
import { StartScreen } from "@screens/start/StartScreen";
import { TAGS_SCREEN_PATH } from "@screens/tags/tags.consts";
import { TagsScreen } from "@screens/tags/tags.screen";
import { TWO_FACTOR_AUTH_OTP_ROUTE, TwoFactorAuthOtpScreen } from "@screens/two-factor-auth-otp";
import {
	TWO_FACTOR_AUTH_RECOVERY_ROUTE,
	TwoFactorAuthRecoveryScreen,
} from "@screens/two-factor-auth-recovery";
import { TWO_FACTOR_AUTH_SETUP_ROUTE, TwoFASetupScreen } from "@screens/two-factor-auth-setup";
import { UsersAdminScreen } from "@screens/users-admin/UsersAdminScreen";
import { RedirectTo } from "../navigation/RedirectTo";
import { type RouteDefinition } from "../navigation/RouteDefinition";

export const Routes: RouteDefinition[] = [
	{
		requiredPermissions: ["UserInAccountPermission_Division_Edit"],
		path: "/settings/divisions",
		element: <DivisionsScreen />,
	},
	{
		requiredPermissions: ["UserInAccountPermission_Region_Edit"],
		path: "/settings/regions",
		element: <RegionsScreen />,
	},
	{
		requiredPermissions: ["UserInAccountPermission_AssignmentRole_Edit"],
		path: "/settings/assignment-roles",
		element: <AssignmentRolesScreen />,
	},
	{
		requiredPermissions: ["UserInAccountPermission_Scenario_Edit"],
		path: "/settings/scenarios",
		element: <ScenariosScreen />,
	},
	{
		requiredPermissions: ["UserInAccountPermission_Staff_Edit"],
		path: "/settings/people",
		element: <PeopleScreen />,
	},
	{
		requiredPermissions: ["UserInAccountPermission_Assessment_Edit"],
		path: SKILL_ASSESSMENTS_PATH,
		element: <SkillAssessments />,
	},
	{
		requiredPermissions: ["UserInAccountPermission_Assessment_Edit"],
		path: SKILL_ASSESSMENT_TEMPLATES_PATH,
		element: <SkillAssessmentTemplates />,
	},
	{
		requiredPermissions: ["UserInAccountPermission_Templates_Edit"],
		path: "/settings/staffing-templates",
		element: <StaffingTemplatesScreen />,
	},
	{
		requiredPermissions: ["UserInAccountPermission_Project_Edit"],
		path: "/settings/projects",
		element: <ProjectsScreen />,
	},
	{
		requiredPermissions: ["UserInAccountPermission_Project_Edit"],
		path: "/settings/project-stages",
		element: <ProjectStagesScreen />,
	},
	{
		requiredPermissions: ["UserInAccountPermission_Skills_Read"],
		path: "/settings/skills",
		element: <SkillsScreen />,
	},
	{
		requiredPermissions: ["UserInAccountPermission_Management_Management"],
		path: "/settings/access",
		element: <AccessScreen />,
	},
	{
		requiredPermissions: ["UserInAccountPermission_Management_Management"],
		path: "/settings/groups",
		element: <GroupsScreen />,
	},
	{
		requiredPermissions: [
			"AccountPermission_System_Root",
			"UserInAccountPermission_Management_Management",
		],
		path: "/settings/email-templates",
		element: <EmailTemplatesScreen />,
	},
	{
		requiredPermissions: [
			"AccountPermission_System_Root",
			"UserInAccountPermission_Management_Management",
		],
		path: "/settings/email-templates/:emailTemplateId/edit",
		element: <EditEmailTemplateScreen />,
	},
	{
		requiredPermissions: [
			"AccountPermission_System_Root",
			"UserInAccountPermission_Management_Management",
		],
		path: "/settings/admin/accounts",
		element: <AccountsAdminScreen />,
	},
	{
		requiredPermissions: [
			"AccountPermission_System_Root",
			"UserInAccountPermission_Management_Management",
		],
		path: "/settings/admin/users",
		element: <UsersAdminScreen />,
	},
	{
		requiredPermissions: ["UserInAccountPermission_Tag_AdminEdit"],
		path: TAGS_SCREEN_PATH,
		element: <TagsScreen />,
	},
	{
		requiredPermissions: ["UserInAccountPermission_Management_Management"],
		path: "/settings/account-settings",
		element: <AccountSettingsScreen />,
	},
	{
		requiredPermissions: "logged-in",
		path: PERSONAL_DATA_SCREEN_PATH,
		element: <PersonalDataScreen />,
	},
	{
		requiredPermissions: "logged-in",
		path: RECOVERY_CODES_SCREEN_PATH,
		element: <RecoveryCodesScreen />,
	},
	{
		requiredPermissions: "logged-in",
		path: ACTIVATE_2FA_SCREEN,
		element: <Activate2FAScreen />,
	},
	{
		requiredPermissions: "logged-in",
		path: "/",
		element: <StartScreen />,
	},
	{
		requiredPermissions: "logged-in",
		path: SCENARIO_PROJECT_VIEW_SCREEN_ROUTE,
		element: <ScenarioProjectViewScreen />,
	},
	{
		requiredPermissions: ["UserInAccountPermission_Maps_Read"],
		path: SCENARIO_MAP_VIEW_SCREEN_ROUTE,
		element: <ScenarioMapViewScreen />,
	},
	{
		requiredPermissions: "logged-in",
		path: SCENARIO_STAFF_VIEW_SCREEN_ROUTE,
		element: <ScenarioStaffViewScreen />,
	},
	{
		requiredPermissions: "logged-in",
		path: AVAILABILITY_FORECAST_SCREEN_ROUTE,
		element: <AvailabilityForecastScreen />,
	},
	{
		requiredPermissions: "logged-in-and-logged-out",
		path: ACCEPT_INVITATION_PATH,
		element: <AcceptInvitationScreen />,
	},
	{
		requiredPermissions: "logged-in-and-logged-out",
		path: ACTIVATION_PATH,
		element: <ActivateScreen />,
	},
	{
		requiredPermissions: "only-logged-out",
		path: TWO_FACTOR_AUTH_SETUP_ROUTE,
		element: <TwoFASetupScreen />,
	},
	{
		requiredPermissions: "only-logged-out",
		path: TWO_FACTOR_AUTH_OTP_ROUTE,
		element: <TwoFactorAuthOtpScreen />,
	},
	{
		requiredPermissions: "only-logged-out",
		path: TWO_FACTOR_AUTH_RECOVERY_ROUTE,
		element: <TwoFactorAuthRecoveryScreen />,
	},
	{
		requiredPermissions: "only-logged-out",
		path: "register",
		element: <RegistrationScreen />,
	},
	{
		requiredPermissions: "only-logged-out",
		path: "forgot-password",
		element: <ForgotPasswordScreen />,
	},
	{
		requiredPermissions: "only-logged-out",
		path: RESET_PASSWORD_PATH,
		element: <ResetPasswordScreen />,
	},
	{
		requiredPermissions: "logged-in-and-logged-out",
		path: "reset",
		element: <ResetScreen />,
	},
	{
		requiredPermissions: "logged-in-and-logged-out",
		path: SKILL_ASSESSMENT_PATH,
		element: <SkillAssessmentWithAuth />,
	},
	{
		requiredPermissions: "logged-in-and-logged-out",
		path: SKILL_ASSESSMENT_EXECUTION_PATH,
		element: <SkillAssessmentExecutionWithAuth />,
	},
	{
		requiredPermissions: "logged-in-and-logged-out",
		path: SKILL_ASSESSMENT_SUCCESS_PATH,
		element: <SkillAssessmentSuccessWithAuth />,
	},
	{
		requiredPermissions: "only-logged-out",
		path: "/login",
		element: <LoginScreen />,
	},
	{
		requiredPermissions: "only-logged-out",
		path: "/login-azure-ad-disclaimer",
		element: <LoginAzureAdDisclaimer />,
	},
	{
		requiredPermissions: "only-logged-out",
		path: "/login/redirect/azure-ad-web",
		element: <LoginAzureAdRedirect />,
	},
	{
		requiredPermissions: "only-logged-out",
		path: "*",
		element: <RedirectTo to={"/login"} />,
	},
];
