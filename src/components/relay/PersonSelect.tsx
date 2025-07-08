import { graphql } from "babel-plugin-relay/macro";
import { Dropdown, type DropdownFilterEvent } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import {
	type PersonSelect_PersonFragment$data,
	type PersonSelect_PersonFragment$key,
} from "../../__generated__/PersonSelect_PersonFragment.graphql";
import { type PersonSelect_Query } from "../../__generated__/PersonSelect_Query.graphql";
import { type ValidatedFieldConfig } from "../ui/ValidatedField";

const PEOPLE_QUERY = graphql`
	query PersonSelect_Query($filterByName: String, $excludeIds: [ID!], $alwaysIncludeIds: [ID!]) {
		Staff {
			People(
				first: 20
				excludeIds: $excludeIds
				filterByName: $filterByName
				alwaysIncludeIds: $alwaysIncludeIds
			) {
				edges {
					node {
						...PersonSelect_PersonFragment
					}
				}
			}
		}
	}
`;

const PERSON_FRAGMENT = graphql`
	fragment PersonSelect_PersonFragment on Person @inline {
		id
		name
	}
`;

export const PersonSelect = (fieldConfig: ValidatedFieldConfig<string>) => {
	const environment = useRelayEnvironment();

	const handleOnFilter = (e: DropdownFilterEvent) => {
		void fetchQuery<PersonSelect_Query>(environment, PEOPLE_QUERY, {
			filterByName: e.filter?.length > 0 ? e.filter : undefined,
			alwaysIncludeIds: fieldConfig.fieldValue ? [fieldConfig.fieldValue] : [],
		})
			.toPromise()
			.then((result) => {
				setPerson(() =>
					result!.Staff.People.edges!.map((e) =>
						readInlineData<PersonSelect_PersonFragment$key>(PERSON_FRAGMENT, e!.node!),
					),
				);
			});
	};
	const [projects, setPerson] = useState<PersonSelect_PersonFragment$data[]>([]);
	useEffect(() => {
		fetchQuery<PersonSelect_Query>(environment, PEOPLE_QUERY, {
			alwaysIncludeIds: fieldConfig.fieldValue ? [fieldConfig.fieldValue] : undefined,
		})
			.toPromise()
			.then((result) => {
				setPerson(() =>
					result!.Staff.People.edges!.map((e) =>
						readInlineData<PersonSelect_PersonFragment$key>(PERSON_FRAGMENT, e!.node!),
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
				{ label: "Unassigned", value: null },
				...projects.map((p) => {
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
			onFilter={handleOnFilter}
		/>
	);
};
