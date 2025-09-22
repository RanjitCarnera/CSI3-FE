import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState } from "react";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import { withDebounce } from "@utils/with-debounce";
import { PEOPLE_QUERY, PERSON_FRAGMENT } from "./people-select.graphql";
import {
	type peopleSelect_PersonFragment$data,
	type peopleSelect_PersonFragment$key,
} from "../../../__generated__/peopleSelect_PersonFragment.graphql";
import { type peopleSelect_Query } from "../../../__generated__/peopleSelect_Query.graphql";
import { type ValidatedFieldConfig } from "../../ui/ValidatedField";

export const PeopleSelect = (fieldConfig: ValidatedFieldConfig<string[]>) => {
	const environment = useRelayEnvironment();

	const [people, setPerson] = useState<peopleSelect_PersonFragment$data[]>([]);
	useEffect(() => {
		fetchQuery<peopleSelect_Query>(environment, PEOPLE_QUERY, {
			alwaysIncludeIds:
				(fieldConfig.fieldValue?.length || 0) > 0 ? fieldConfig.fieldValue : undefined,
		})
			.toPromise()
			.then((result) => {
				setPerson(() =>
					result!.Staff.People.edges!.map((e) =>
						readInlineData<peopleSelect_PersonFragment$key>(PERSON_FRAGMENT, e!.node!),
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
				fetchQuery<peopleSelect_Query>(environment, PEOPLE_QUERY, {
					filterByName: e.filter?.length > 0 ? e.filter : undefined,
					alwaysIncludeIds:
						(fieldConfig.fieldValue?.length || 0) > 0
							? fieldConfig.fieldValue
							: undefined,
				})
					.toPromise()
					.then((result) => {
						setPerson(() =>
							result!.Staff.People.edges!.map((e) =>
								readInlineData<peopleSelect_PersonFragment$key>(
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

export const DebouncedPeopleSelect = withDebounce(PeopleSelect);
