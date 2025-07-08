import { type ReactNode } from "react";
import { type Permission } from "@relay/PermissionBasedNavigation_CurrentUser.graphql";

export interface RouteDefinition {
	requiredPermissions:
		| Permission[]
		| "logged-in"
		| "logged-in-and-logged-out"
		| "only-logged-out";
	path: string;
	element: ReactNode;
}
