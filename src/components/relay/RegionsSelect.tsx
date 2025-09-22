import { graphql } from "babel-plugin-relay/macro";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState } from "react";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import { withDebounce } from "@utils/with-debounce";
import { type RegionsSelect_Query } from "../../__generated__/RegionsSelect_Query.graphql";
import {
	type RegionsSelect_RegionFragment$data,
	type RegionsSelect_RegionFragment$key,
} from "../../__generated__/RegionsSelect_RegionFragment.graphql";
import { type ValidatedFieldConfig } from "../ui/ValidatedField";

const PEOPLE_QUERY = graphql`
	query RegionsSelect_Query($filterByName: String, $excludeIds: [ID!], $alwaysIncludeIds: [ID!]) {
		Region {
			Regions(
				first: 20
				excludeIds: $excludeIds
				filterByName: $filterByName
				alwaysIncludeIds: $alwaysIncludeIds
			) {
				edges {
					node {
						...RegionsSelect_RegionFragment
					}
				}
			}
		}
	}
`;

const PERSON_FRAGMENT = graphql`
	fragment RegionsSelect_RegionFragment on Region @inline {
		id
		name
	}
`;

export const RegionsSelect = (fieldConfig: ValidatedFieldConfig<string[]>) => {
	const environment = useRelayEnvironment();

	const [regions, setRegion] = useState<RegionsSelect_RegionFragment$data[]>([]);
	useEffect(() => {
		fetchQuery<RegionsSelect_Query>(environment, PEOPLE_QUERY, {})
			.toPromise()
			.then((result) => {
				setRegion(() =>
					result!.Region.Regions.edges!.map((e) =>
						readInlineData<RegionsSelect_RegionFragment$key>(PERSON_FRAGMENT, e!.node!),
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
				fetchQuery<RegionsSelect_Query>(environment, PEOPLE_QUERY, {
					filterByName: e.filter?.length > 0 ? e.filter : undefined,
					alwaysIncludeIds:
						(fieldConfig.fieldValue?.length || 0) > 0
							? fieldConfig.fieldValue
							: undefined,
				})
					.toPromise()
					.then((result) => {
						setRegion(() =>
							result!.Region.Regions.edges!.map((e) =>
								readInlineData<RegionsSelect_RegionFragment$key>(
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

export const DebouncedRegionsSelect = withDebounce(RegionsSelect);
