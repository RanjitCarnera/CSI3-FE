import { graphql } from "babel-plugin-relay/macro";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState } from "react";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import { withDebounce } from "@utils/with-debounce";
import {
	type ProjectStagesSelect_ProjectStageFragment$data,
	type ProjectStagesSelect_ProjectStageFragment$key,
} from "../../__generated__/ProjectStagesSelect_ProjectStageFragment.graphql";
import { type ProjectStagesSelect_Query } from "../../__generated__/ProjectStagesSelect_Query.graphql";
import { type ValidatedFieldConfig } from "../ui/ValidatedField";

const PEOPLE_QUERY = graphql`
	query ProjectStagesSelect_Query(
		$filterByName: String
		$excludeIds: [ID!]
		$alwaysIncludeIds: [ID!]
	) {
		Project {
			ProjectStages(
				first: 20
				excludeIds: $excludeIds
				filterByName: $filterByName
				alwaysIncludeIds: $alwaysIncludeIds
			) {
				edges {
					node {
						...ProjectStagesSelect_ProjectStageFragment
					}
				}
			}
		}
	}
`;

const PERSON_FRAGMENT = graphql`
	fragment ProjectStagesSelect_ProjectStageFragment on ProjectStage @inline {
		id
		name
	}
`;

export const ProjectStagesSelect = (fieldConfig: ValidatedFieldConfig<string[]>) => {
	const environment = useRelayEnvironment();

	const [regions, setProjectStage] = useState<ProjectStagesSelect_ProjectStageFragment$data[]>(
		[],
	);
	useEffect(() => {
		fetchQuery<ProjectStagesSelect_Query>(environment, PEOPLE_QUERY, {})
			.toPromise()
			.then((result) => {
				setProjectStage(() =>
					result!.Project.ProjectStages.edges!.map((e) =>
						readInlineData<ProjectStagesSelect_ProjectStageFragment$key>(
							PERSON_FRAGMENT,
							e!.node!,
						),
					),
				);
			});
		// eslint-disable-next-line
	}, []);

	return (
		<MultiSelect
			name={fieldConfig.fieldName}
			disabled={fieldConfig.disabled}
			value={fieldConfig.fieldValue}
			options={[
				...regions.map((p) => {
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
			placeholder={fieldConfig.placeholder}
			filterBy={"name"}
			onFilter={(e) => {
				fetchQuery<ProjectStagesSelect_Query>(environment, PEOPLE_QUERY, {
					filterByName: e.filter?.length > 0 ? e.filter : undefined,
					alwaysIncludeIds:
						(fieldConfig.fieldValue?.length || 0) > 0
							? fieldConfig.fieldValue
							: undefined,
				})
					.toPromise()
					.then((result) => {
						setProjectStage(() =>
							result!.Project.ProjectStages.edges!.map((e) =>
								readInlineData<ProjectStagesSelect_ProjectStageFragment$key>(
									PERSON_FRAGMENT,
									e!.node!,
								),
							),
						);
					});
			}}
		/>
	);
};

export const DebouncedProjectStagesSelect = withDebounce(ProjectStagesSelect);
