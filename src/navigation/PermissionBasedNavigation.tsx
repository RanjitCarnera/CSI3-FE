import graphql from "babel-plugin-relay/macro";
import _, { isArray } from "lodash";
import React, { type ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import { readInlineData, useLazyLoadQuery } from "react-relay";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { setCurrentUser } from "@redux/CurrentUserSlice";
import { setActiveFeatureToggleIds } from "@redux/feature-toggles";
import {
	type PermissionBasedNavigation_CurrentUser$data,
	type PermissionBasedNavigation_CurrentUser$key,
} from "@relay/PermissionBasedNavigation_CurrentUser.graphql";
import { type PermissionBasedNavigation_Query } from "@relay/PermissionBasedNavigation_Query.graphql";
import { type Permission } from "@relay/PermissionsField_Query.graphql";
import { RedirectTo } from "./RedirectTo";
import { type RouteDefinition } from "./RouteDefinition";

const QUERY = graphql`
	query PermissionBasedNavigation_Query {
		FeatureToggle {
			ActiveFeatureToggleIds
		}
		Viewer {
			Auth {
				currentUser {
					...PermissionBasedNavigation_CurrentUser
				}
			}
		}
	}
`;

const CURRENT_USER_INLINE_FRAGMENT = graphql`
	fragment PermissionBasedNavigation_CurrentUser on CurrentUser @inline {
		permissionsInAccount
		user {
			name
			id
			extension {
				... on HarkinsUserExtensionAndId {
					budgetDisplay
					preferredViewType
					showVolumePerPerson
					unitSystem
					utilizationDisplay
				}
			}
		}
		accounts {
			id
			name
			extensions {
				kind
				... on AccountSettingsAccountExtension {
					useStagesColorsForProjectNames
				}
			}
		}
	}
`;

interface OwnProps {
	routes: RouteDefinition[];
	forbiddenRoute?: ReactElement;
}

export function PermissionBasedNavigation({ routes, forbiddenRoute }: OwnProps) {
	const query = useLazyLoadQuery<PermissionBasedNavigation_Query>(QUERY, {});
	const dispatch = useDispatch();
	const currentUserData = readInlineData<PermissionBasedNavigation_CurrentUser$key>(
		CURRENT_USER_INLINE_FRAGMENT,
		query.Viewer.Auth.currentUser,
	);
	useEffect(() => {
		if (currentUserData) {
			dispatch(
				setCurrentUser(
					currentUserData as Writable<PermissionBasedNavigation_CurrentUser$data>,
				),
			);
		}
		dispatch(setActiveFeatureToggleIds([...query.FeatureToggle.ActiveFeatureToggleIds]));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	return (
		<BrowserRouter>
			<Routes>
				{filterByPermission(routes, !!currentUserData, [
					...(currentUserData?.permissionsInAccount ?? []),
				]).map((prd) => {
					return <Route key={prd.path} path={prd.path} element={prd.element} />;
				})}

				<Route
					key={"verboten"}
					path={"*"}
					element={
						forbiddenRoute || (
							<div>
								<RedirectTo to="/" />
							</div>
						)
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export type RequiredPermissionsType =
	| Permission[]
	| "logged-in"
	| "logged-in-and-logged-out"
	| "only-logged-out";

export interface HasRequiredPermissionsType {
	requiredPermissions: RequiredPermissionsType;
}

export function filterByPermission<ItemType extends HasRequiredPermissionsType>(
	items: ItemType[],
	isLoggedIn: boolean,
	permissionsInAccount?: Permission[],
) {
	return items.filter((r) => {
		const loggedOutAndRouteRequiresLoggedOut =
			r.requiredPermissions === "only-logged-out" && !isLoggedIn;
		const loggedInAndRouteOnlyRequiredLoggedIn =
			r.requiredPermissions === "logged-in" && isLoggedIn;
		const loggedInOrLoggedOut = r.requiredPermissions === "logged-in-and-logged-out";

		const permissionsAreKnown = permissionsInAccount && isArray(r.requiredPermissions);
		const isRoot = permissionsInAccount?.includes("AccountPermission_System_Root");
		const noRootPermissionRequiredAndUserIsOwner =
			!r.requiredPermissions.includes("AccountPermission_System_Root") &&
			permissionsInAccount?.includes("UserInAccountPermission_System_Owner");
		const isLoggedInAndHasAllNecessaryPermissions =
			permissionsAreKnown &&
			(_.difference(r.requiredPermissions, permissionsInAccount).length === 0 ||
				isRoot ||
				noRootPermissionRequiredAndUserIsOwner);

		return (
			loggedInOrLoggedOut ||
			loggedOutAndRouteRequiresLoggedOut ||
			loggedInAndRouteOnlyRequiredLoggedIn ||
			isLoggedInAndHasAllNecessaryPermissions
		);
	});
}
