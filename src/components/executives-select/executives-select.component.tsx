import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState } from "react";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import {
	EXECUTIVES_QUERY,
	PERSON_FRAGMENT,
} from "@components/executives-select/executives-select.graphql";
import { type ValidatedFieldConfig } from "@components/ui/ValidatedField";
import {
	type executivesSelect_PersonFragment$data,
	type executivesSelect_PersonFragment$key,
} from "@relay/executivesSelect_PersonFragment.graphql";
import { type executivesSelect_Query } from "@relay/executivesSelect_Query.graphql";
import { withDebounce } from "@utils/with-debounce";

export const ExecutivesSelect = ({
	scenarioId,
	...fieldConfig
}: ValidatedFieldConfig<string[]> & { scenarioId?: string }) => {
	const environment = useRelayEnvironment();

	const [people, setPerson] = useState<executivesSelect_PersonFragment$data[]>([]);
	useEffect(() => {
		void fetchQuery<executivesSelect_Query>(environment, EXECUTIVES_QUERY, {
			scenarioId,
			alwaysIncludeIds:
				(fieldConfig.fieldValue?.length ?? 0) > 0 ? fieldConfig.fieldValue : undefined,
		})
			.toPromise()
			.then((result) => {
				setPerson(() =>
					result!.Staff.Executives.edges!.map((e) =>
						readInlineData<executivesSelect_PersonFragment$key>(
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
			value={fieldConfig.fieldValue}
			disabled={fieldConfig.disabled}
			options={[
				...people.map((p) => {
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
				void fetchQuery<executivesSelect_Query>(environment, EXECUTIVES_QUERY, {
					filterByName: e.filter?.length > 0 ? e.filter : undefined,
					scenarioId,
					alwaysIncludeIds:
						(fieldConfig.fieldValue?.length ?? 0) > 0
							? fieldConfig.fieldValue
							: undefined,
				})
					.toPromise()
					.then((result) => {
						setPerson(() =>
							result!.Staff.Executives.edges!.map((e) =>
								readInlineData<executivesSelect_PersonFragment$key>(
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

export const DebouncedExecutivesSelect = withDebounce(ExecutivesSelect);
