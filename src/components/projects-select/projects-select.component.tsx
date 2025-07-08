import { graphql } from "babel-plugin-relay/macro";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState } from "react";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import type { ValidatedFieldConfig } from "@components/ui/ValidatedField";
import {
	type projectsSelect_ProjectInlineFragment$data,
	type projectsSelect_ProjectInlineFragment$key,
} from "@relay/projectsSelect_ProjectInlineFragment.graphql";
import { type projectsSelect_Query } from "@relay/projectsSelect_Query.graphql";

const PROJECTS_QUERY = graphql`
	query projectsSelect_Query($filterByName: String, $alwaysIncludeIds: [ID!]) {
		Project {
			Projects(first: 100, filterByName: $filterByName, alwaysIncludeIds: $alwaysIncludeIds) {
				edges {
					node {
						...projectsSelect_ProjectInlineFragment
					}
				}
			}
		}
	}
`;

const PROJECT_INLINE_FRAGMENT = graphql`
	fragment projectsSelect_ProjectInlineFragment on Project @inline {
		id
		name
	}
`;

export const ProjectsSelect = (fieldConfig: ValidatedFieldConfig<string[]>) => {
	const environment = useRelayEnvironment();

	const [projects, setProjects] = useState<projectsSelect_ProjectInlineFragment$data[]>([]);
	useEffect(() => {
		void fetchQuery<projectsSelect_Query>(environment, PROJECTS_QUERY, {})
			.toPromise()
			.then((result) => {
				setProjects(() =>
					result!.Project.Projects.edges!.map((e) =>
						readInlineData<projectsSelect_ProjectInlineFragment$key>(
							PROJECT_INLINE_FRAGMENT,
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
			options={projects.map((p) => {
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
				void fetchQuery<projectsSelect_Query>(environment, PROJECTS_QUERY, {
					filterByName: e.filter?.length > 0 ? e.filter : undefined,
					alwaysIncludeIds:
						(fieldConfig.fieldValue?.length || 0) > 0
							? fieldConfig.fieldValue
							: undefined,
				})
					.toPromise()
					.then((result) => {
						setProjects(() =>
							result!.Project.Projects.edges!.map((e) =>
								readInlineData<projectsSelect_ProjectInlineFragment$key>(
									PROJECT_INLINE_FRAGMENT,
									e!.node!,
								),
							),
						);
					});
			}}
		/>
	);
};
