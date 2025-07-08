import { graphql } from "babel-plugin-relay/macro";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState } from "react";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import {
	type AssignmentRolesSelect_AssignmentRoleFragment$data,
	type AssignmentRolesSelect_AssignmentRoleFragment$key,
} from "../../__generated__/AssignmentRolesSelect_AssignmentRoleFragment.graphql";
import { type AssignmentRolesSelect_Query } from "../../__generated__/AssignmentRolesSelect_Query.graphql";
import { type ValidatedFieldConfig } from "../ui/ValidatedField";

const PROJECTS_QUERY = graphql`
	query AssignmentRolesSelect_Query($filterByName: String, $alwaysIncludeIds: [ID!]) {
		Assignments {
			AssignmentRoles(
				first: 100
				filterByName: $filterByName
				alwaysIncludeIds: $alwaysIncludeIds
			) {
				edges {
					node {
						...AssignmentRolesSelect_AssignmentRoleFragment
					}
				}
			}
		}
	}
`;

const PROJECT_FRAGMENT = graphql`
	fragment AssignmentRolesSelect_AssignmentRoleFragment on AssignmentRole @inline {
		id
		name
	}
`;

export const AssignmentRolesSelect = (fieldConfig: ValidatedFieldConfig<string[]>) => {
	const environment = useRelayEnvironment();

	const [assignmentRoles, setAssignmentRoles] = useState<
		AssignmentRolesSelect_AssignmentRoleFragment$data[]
	>([]);
	useEffect(() => {
		fetchQuery<AssignmentRolesSelect_Query>(environment, PROJECTS_QUERY, {})
			.toPromise()
			.then((result) => {
				setAssignmentRoles(() =>
					result!.Assignments.AssignmentRoles.edges!.map((e) =>
						readInlineData<AssignmentRolesSelect_AssignmentRoleFragment$key>(
							PROJECT_FRAGMENT,
							e!.node!,
						),
					),
				);
			});
		// eslint-disable-next-line
    }, [])


	return (
		<MultiSelect
			name={fieldConfig.fieldName}
			value={fieldConfig.fieldValue}
			disabled={fieldConfig.disabled}
			options={assignmentRoles.map((p) => {
				return {
					label: p.name,
					name: p.name,
					value: p.id,
				};
			})}
			onChange={(e) => {
				fieldConfig.updateField(e.value);
			}}
			filter={true}
			placeholder={
				fieldConfig.fieldValue?.length
					? `${fieldConfig.fieldValue.length} selected`
					: fieldConfig.placeholder
			}
			filterBy={"name"}
			fixedPlaceholder={true}
			onFilter={(e) => {
				fetchQuery<AssignmentRolesSelect_Query>(environment, PROJECTS_QUERY, {
					filterByName: e.filter?.length > 0 ? e.filter : undefined,
					alwaysIncludeIds:
						(fieldConfig.fieldValue?.length || 0) > 0
							? fieldConfig.fieldValue
							: undefined,
				})
					.toPromise()
					.then((result) => {
						setAssignmentRoles(() =>
							result!.Assignments.AssignmentRoles.edges!.map((e) =>
								readInlineData<AssignmentRolesSelect_AssignmentRoleFragment$key>(
									PROJECT_FRAGMENT,
									e!.node!,
								),
							),
						);
					});
			}}
		/>
	);
};
