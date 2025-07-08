import { graphql } from "babel-plugin-relay/macro";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import { type SelectUserField_Query } from "../../__generated__/SelectUserField_Query.graphql";
import {
	type SelectUserField_UserFragment$data,
	type SelectUserField_UserFragment$key,
} from "../../__generated__/SelectUserField_UserFragment.graphql";
import { selectJwtClaimData } from "../../redux/AuthSlice";
import { selectPermissionsInAccount } from "../../redux/CurrentUserSlice";
import { type ValidatedFieldConfig } from "../ui/ValidatedField";

const QUERY = graphql`
	query SelectUserField_Query(
		$filterByName: String
		$alwaysIncludeIds: [ID!]
		$excludeIds: [ID!]
	) {
		Admin {
			Management {
				UsersAdmin(
					first: 20
					filterByName: $filterByName
					alwaysIncludeIds: $alwaysIncludeIds
					excludeIds: $excludeIds
				) {
					edges {
						node {
							id
							...SelectUserField_UserFragment
						}
					}
				}
			}
		}
	}
`;

const USERS_FRAGMENT = graphql`
	fragment SelectUserField_UserFragment on User @inline {
		id
		name
	}
`;

export const SelectUserField = ({
	fieldValue,
	fieldName,
	updateField,
	disabled,
	placeholder,
}: ValidatedFieldConfig<string>) => {
	const environment = useRelayEnvironment();
	const claimData = useSelector(selectJwtClaimData);
	const permissionsInAccount = useSelector(selectPermissionsInAccount);

	const [users, setUsers] = useState<SelectUserField_UserFragment$data[]>([]);

	useEffect(() => {
		if (permissionsInAccount?.includes("AccountPermission_System_Root")) {
			console.log("claimData?.userId", claimData?.userId);
			fetchQuery<SelectUserField_Query>(environment, QUERY, {
				alwaysIncludeIds: fieldValue ? [fieldValue] : undefined,
				excludeIds: claimData?.userId ? [] : undefined,
			})
				.toPromise()
				.then((result) => {
					setUsers(() =>
						result!.Admin.Management.UsersAdmin.edges!.map((e) =>
							readInlineData<SelectUserField_UserFragment$key>(
								USERS_FRAGMENT,
								e!.node!,
							),
						),
					);
				});
		}
		// eslint-disable-next-line
	}, []);

	return (
		<Dropdown
			className="mr-2"
			emptyMessage={"Search for users"}
			disabled={disabled}
			placeholder={placeholder}
			name={fieldName}
			value={fieldValue}
			options={[
				{ label: "N/A", value: null },
				...users.map((p) => {
					return {
						label: p.name,
						name: p.name,
						value: p.id,
					};
				}),
			]}
			onChange={(e) => {
				updateField(e.value);
			}}
			filter={true}
			filterBy={"name"}
			onFilter={(e) => {
				fetchQuery<SelectUserField_Query>(environment, QUERY, {
					filterByName: e.filter?.length > 0 ? e.filter : undefined,
					alwaysIncludeIds: fieldValue ? [fieldValue] : undefined,
					excludeIds: claimData?.userId ? [] : undefined,
				})
					.toPromise()
					.then((result) => {
						setUsers(() =>
							result!.Admin.Management.UsersAdmin.edges!.map((e) =>
								readInlineData<SelectUserField_UserFragment$key>(
									USERS_FRAGMENT,
									e!.node!,
								),
							),
						);
					});
			}}
		/>
	);
};
