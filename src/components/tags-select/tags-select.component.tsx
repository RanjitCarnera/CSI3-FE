import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState } from "react";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import { QUERY, TAG_INLINE_FRAGMENT } from "@components/tags-select/tags-select.graphql";
import type { ValidatedFieldConfig } from "@components/ui/ValidatedField";
import { type tagsSelect_Query } from "@relay/tagsSelect_Query.graphql";
import {
	type tagsSelect_TagInlineFragment$data,
	type tagsSelect_TagInlineFragment$key,
} from "@relay/tagsSelect_TagInlineFragment.graphql";

export const TagsSelect = (fieldConfig: ValidatedFieldConfig<string[]>) => {
	const environment = useRelayEnvironment();
	const [tags, setTags] = useState<tagsSelect_TagInlineFragment$data[]>([]);

	useEffect(() => {
		fetch("");
	}, []);

	const fetch = (name: string) => {
		void fetchQuery<tagsSelect_Query>(
			environment,
			QUERY,
			{ name },
			{ fetchPolicy: "store-or-network" },
		)
			.toPromise()
			.then((res) => {
				const nodes = res?.Tag.GetTagsByName.edges?.map((e) => e?.node!) ?? [];
				const tags = nodes.map((node) =>
					readInlineData<tagsSelect_TagInlineFragment$key>(TAG_INLINE_FRAGMENT, node),
				);
				setTags(tags);
			});
	};
	return (
		<MultiSelect
			name={fieldConfig.fieldName}
			value={fieldConfig.fieldValue}
			disabled={fieldConfig.disabled}
			options={[
				...tags.map((p) => {
					return {
						label: p.data.name,
						value: p.id,
						color: p.data.color,
					};
				}),
			]}
			onChange={(e) => {
				fieldConfig.updateField(e.value);
			}}
			filter={true}
			placeholder={fieldConfig.placeholder}
			filterBy={"label"}
			onFilter={(e) => {
				fetch(e?.filter ?? "");
			}}
		/>
	);
};
