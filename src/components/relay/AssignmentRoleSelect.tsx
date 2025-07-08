import { graphql } from "babel-plugin-relay/macro";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import {
	type AssignmentRoleSelect_AssignmentRoleFragment$data,
	type AssignmentRoleSelect_AssignmentRoleFragment$key,
} from "../../__generated__/AssignmentRoleSelect_AssignmentRoleFragment.graphql";
import { type AssignmentRoleSelect_Query } from "../../__generated__/AssignmentRoleSelect_Query.graphql";
import { type ValidatedFieldConfig } from "../ui/ValidatedField";

const QUERY = graphql`
	query AssignmentRoleSelect_Query($filterByName: String, $alwaysIncludeIds: [ID!]) {
		Assignments {
			AssignmentRoles(
				first: 100
				filterByName: $filterByName
				alwaysIncludeIds: $alwaysIncludeIds
			) {
				edges {
					node {
						...AssignmentRoleSelect_AssignmentRoleFragment
					}
				}
			}
		}
	}
`;

const ASSIGNMENT_ROLE_INLINE_FRAGMENT = graphql`
	fragment AssignmentRoleSelect_AssignmentRoleFragment on AssignmentRole @inline {
		id
		name
	}
`;

export const AssignmentRoleSelect = (fieldConfig: ValidatedFieldConfig<string>) => {
	const environment = useRelayEnvironment();

	const [assignmentRoles, setAssignmentRoles] = useState<
		AssignmentRoleSelect_AssignmentRoleFragment$data[]
	>([]);
	useEffect(() => {
		fetchQuery<AssignmentRoleSelect_Query>(environment, QUERY, {})
			.toPromise()
			.then((result) => {
				setAssignmentRoles(() =>
					result!.Assignments.AssignmentRoles.edges!.map((e) =>
						readInlineData<AssignmentRoleSelect_AssignmentRoleFragment$key>(
							ASSIGNMENT_ROLE_INLINE_FRAGMENT,
							e!.node!,
						),
					),
				);
			});
		// eslint-disable-next-line
    }, [])

	return (
		<Dropdown
			name={fieldConfig.fieldName}
			value={fieldConfig.fieldValue}
			options={[
				{
					label: "None",
					name: "None",
					value: null,
				},
				...assignmentRoles.map((p) => {
					return {
						label: p.name,
						name: p.name,
						value: p.id,
					};
				}),
			]}
			onChange={(e) => {
				fieldConfig.updateField(e.value);
			}}
			filter={true}
			filterBy={"name"}
			onFilter={(e) => {
				fetchQuery<AssignmentRoleSelect_Query>(environment, QUERY, {
					filterByName: e.filter?.length > 0 ? e.filter : undefined,
					alwaysIncludeIds: fieldConfig.fieldValue ? [fieldConfig.fieldValue] : undefined,
				})
					.toPromise()
					.then((result) => {
						setAssignmentRoles(() =>
							result!.Assignments.AssignmentRoles.edges!.map((e) =>
								readInlineData<AssignmentRoleSelect_AssignmentRoleFragment$key>(
									ASSIGNMENT_ROLE_INLINE_FRAGMENT,
									e!.node!,
								),
							),
						);
					});
			}}
		/>
	);
};
