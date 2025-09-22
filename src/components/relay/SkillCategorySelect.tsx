import { graphql } from "babel-plugin-relay/macro";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import { withDebounce } from "@utils/with-debounce";
import { type SkillCategorySelect_Query } from "../../__generated__/SkillCategorySelect_Query.graphql";
import {
	type SkillCategorySelect_SkillCategoryFragment$data,
	type SkillCategorySelect_SkillCategoryFragment$key,
} from "../../__generated__/SkillCategorySelect_SkillCategoryFragment.graphql";
import { type ValidatedFieldConfig } from "../ui/ValidatedField";

const QUERY = graphql`
	query SkillCategorySelect_Query($filterByName: String, $alwaysIncludeIds: [ID!]) {
		Skills {
			SkillCategories(
				first: 20
				filterByName: $filterByName
				alwaysIncludeIds: $alwaysIncludeIds
			) {
				edges {
					node {
						...SkillCategorySelect_SkillCategoryFragment
					}
				}
			}
		}
	}
`;

const FRAGMENT = graphql`
	fragment SkillCategorySelect_SkillCategoryFragment on SkillCategory @inline {
		id
		name
	}
`;

export const SkillCategorySelect = (fieldConfig: ValidatedFieldConfig<string>) => {
	const environment = useRelayEnvironment();

	const [assignmentRoles, setSkillCategories] = useState<
		SkillCategorySelect_SkillCategoryFragment$data[]
	>([]);
	useEffect(() => {
		fetchQuery<SkillCategorySelect_Query>(
			environment,
			QUERY,
			{},
			{ fetchPolicy: "network-only" },
		)
			.toPromise()
			.then((result) => {
				setSkillCategories(() =>
					result!.Skills.SkillCategories.edges!.map((e) =>
						readInlineData<SkillCategorySelect_SkillCategoryFragment$key>(
							FRAGMENT,
							e!.node!,
						),
					),
				);
			});
		// eslint-disable-next-line
	}, []);

	return (
		<Dropdown
			name={fieldConfig.fieldName}
			value={fieldConfig.fieldValue}
			placeholder={fieldConfig.placeholder}
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
			filterBy={"name"}
			onFilter={(e) => {
				fetchQuery<SkillCategorySelect_Query>(environment, QUERY, {
					filterByName: e.filter?.length > 0 ? e.filter : undefined,
					alwaysIncludeIds: fieldConfig.fieldValue ? [fieldConfig.fieldValue] : undefined,
				})
					.toPromise()
					.then((result) => {
						setSkillCategories(() =>
							result!.Skills.SkillCategories.edges!.map((e) =>
								readInlineData<SkillCategorySelect_SkillCategoryFragment$key>(
									FRAGMENT,
									e!.node!,
								),
							),
						);
					});
			}}
		/>
	);
};

export const DebouncedSkillCategorySelect = withDebounce(SkillCategorySelect);
