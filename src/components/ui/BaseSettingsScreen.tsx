import { graphql } from "babel-plugin-relay/macro";
import { type MenuItem } from "primereact/menuitem";
import React, { type ReactNode } from "react";
import { useSelector } from "react-redux";
import { useLazyLoadQuery } from "react-relay";
import { EMAIL_TEMPLATES_PATH } from "@screens/email-templates";
import { PERSONAL_DATA_SCREEN_PATH } from "@screens/personal-data";
import { SKILL_ASSESSMENT_TEMPLATES_PATH } from "@screens/skill-assessment-templates/skill-assessment-templates.consts";
import { SKILL_ASSESSMENTS_PATH } from "@screens/skill-assessments/skill-assessments.consts";
import { TAGS_SCREEN_PATH } from "@screens/tags/tags.consts";
import { AccountSwitcher } from "./AccountSwitcher";
import { BaseScreen } from "./base-screen";
import { RouterMenuItem } from "./RouterMenuItem";
import { TkCard } from "./TkCard";
import { TkMenu } from "./TkMenu";
import { type BaseSettingsScreen_Query } from "../../__generated__/BaseSettingsScreen_Query.graphql";
import {
	filterByPermission,
	type HasRequiredPermissionsType,
} from "../../navigation/PermissionBasedNavigation";
import { selectPermissionsInAccount } from "../../redux/CurrentUserSlice";
import { LoginAsUsersControl } from "../relay/LoginAsUsersControl";

const QUERY = graphql`
	query BaseSettingsScreen_Query {
		...baseScreen_QueryFragment
	}
`;

interface OwnProps {
	children?: ReactNode;
	headerComponents?: ReactNode;
}

export const BaseSettingsScreen = ({ children, headerComponents }: OwnProps) => {
	const permissionsInAccount = useSelector(selectPermissionsInAccount);

	const itemsToShow = filterByPermission(SETTINGS_MENU_ITEMS, true, [...permissionsInAccount]);
	const query = useLazyLoadQuery<BaseSettingsScreen_Query>(QUERY, {});

	return (
		<BaseScreen
			queryFragmentRef={query}
			headerComponents={
				<>
					{headerComponents}
					<div className="ml-auto flex justify-content-end">
						<LoginAsUsersControl className="mr-5" />
						<AccountSwitcher />
					</div>
				</>
			}
		>
			<div id={"grid"} className="grid h-full">
				<div className="col-2 h-full overflow-y-auto">
					<TkCard className="card-flat">
						<TkMenu
							className="flex-grow-1 border-0"
							style={{ width: "100%" }}
							model={itemsToShow}
						/>
					</TkCard>
				</div>

				<div className="col-10 h-full overflow-x-hidden overflow-y-auto">{children}</div>
			</div>
		</BaseScreen>
	);
};

export const SETTINGS_MENU_ITEMS: Array<MenuItem & HasRequiredPermissionsType> = [
	{
		label: "Settings",
		template: (item) => <h3>{item.label}</h3>,
		requiredPermissions: ["UserInAccountPermission_AssignmentRole_Edit"],
	},
	{
		label: "Projects",
		url: "/settings/projects",
		icon: "pi pi-building",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: ["UserInAccountPermission_Project_Edit"],
	},
	{
		label: "Project Stages",
		url: "/settings/project-stages",
		icon: "pi pi-flag",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: ["UserInAccountPermission_Project_Edit"],
	},
	{
		label: "Scenarios",
		url: "/settings/scenarios",
		icon: "pi pi-database",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: ["UserInAccountPermission_Scenario_Edit"],
	},
	{
		label: "Assignment Roles",
		url: "/settings/assignment-roles",
		icon: "pi pi-sitemap",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: ["UserInAccountPermission_AssignmentRole_Edit"],
	},
	{
		label: "Resources",
		url: "/settings/people",
		icon: "pi pi-users",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: ["UserInAccountPermission_Staff_Edit"],
	},
	{
		label: "Assessments",
		url: SKILL_ASSESSMENTS_PATH,
		icon: "pi pi-star",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: ["UserInAccountPermission_Assessment_Edit"],
	},
	{
		label: "Assessments Templates",
		url: SKILL_ASSESSMENT_TEMPLATES_PATH,
		icon: "pi pi-chart-line",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: ["UserInAccountPermission_Assessment_Edit"],
	},
	{
		label: "Divisions",
		url: "/settings/divisions",
		icon: "pi pi-compass",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: ["UserInAccountPermission_Division_Edit"],
	},
	{
		label: "Offices / Regions",
		url: "/settings/regions",
		icon: "pi pi-map",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: ["UserInAccountPermission_Region_Edit"],
	},
	{
		label: "Attributes",
		url: "/settings/skills",
		icon: "pi pi-chart-bar",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: ["UserInAccountPermission_Skills_Read"],
	},
	{
		label: "Staffing Templates",
		url: "/settings/staffing-templates",
		icon: "pi pi-list",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: ["UserInAccountPermission_Templates_Edit"],
	},
	{
		label: "Tags",
		url: TAGS_SCREEN_PATH,
		icon: "pi pi-chart-line",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: ["UserInAccountPermission_Tag_AdminEdit"],
	},
	{
		label: "Account Settings",
		template: (item) => <h3>{item.label}</h3>,
		requiredPermissions: ["UserInAccountPermission_Management_Management"],
	},
	{
		label: "Account settings",
		url: "/settings/account-settings",
		icon: "pi pi-cog",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: ["UserInAccountPermission_Management_Management"],
	},
	{
		label: "Access",
		url: "/settings/access",
		icon: "pi pi-lock",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: ["UserInAccountPermission_Management_Management"],
	},
	{
		label: "Groups",
		url: "/settings/groups",
		icon: "pi pi-sitemap",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: ["UserInAccountPermission_Management_Management"],
	},

	{
		label: "Personal Settings",
		template: (item) => <h3>{item.label}</h3>,
		requiredPermissions: ["UserInAccountPermission_Management_Management"],
	},
	{
		label: "Data",
		url: PERSONAL_DATA_SCREEN_PATH,
		icon: "pi pi-user",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: "logged-in",
	},
	{
		label: "Administrative Settings",
		template: (item) => <h3>{item.label}</h3>,
		requiredPermissions: [
			"AccountPermission_System_Root",
			"UserInAccountPermission_Management_Management",
		],
	},
	{
		label: "Accounts",
		url: "/settings/admin/accounts",
		icon: "pi pi-id-card",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: [
			"AccountPermission_System_Root",
			"UserInAccountPermission_Management_Management",
		],
	},
	{
		label: "Users",
		url: "/settings/admin/users",
		icon: "pi pi-id-card",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: [
			"AccountPermission_System_Root",
			"UserInAccountPermission_Management_Management",
		],
	},
	{
		label: "E-Mail Templates",
		url: EMAIL_TEMPLATES_PATH,
		icon: "pi pi-id-card",
		template: (item) => <RouterMenuItem item={item} />,
		requiredPermissions: [
			"AccountPermission_System_Root",
			"UserInAccountPermission_Management_Management",
		],
	},
];
