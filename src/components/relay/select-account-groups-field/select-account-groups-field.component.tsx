import { MultiSelect } from "primereact/multiselect";
import { useLazyLoadQuery } from "react-relay";
import { withFieldFallback } from "@components/field";
import { SELECT_ACCOUNT_GROUPS_FIELD_QUERY } from "@components/relay/select-account-groups-field/select-account-groups-field.graphql";
import { type selectAccountGroupsField_Query } from "@relay/selectAccountGroupsField_Query.graphql";
import { type ValidatedFieldConfig } from "../../ui/ValidatedField";

export const SelectAccountGroupsField = ({
	fieldValue,
	fieldName,
	updateField,
}: ValidatedFieldConfig<string[]>) => {
	const {
		Admin: {
			Management: {
				AccountGroups: { edges: groups },
			},
		},
	} = useLazyLoadQuery<selectAccountGroupsField_Query>(SELECT_ACCOUNT_GROUPS_FIELD_QUERY, {});

	return (
		<MultiSelect
			name={fieldName}
			value={fieldValue}
			options={groups
				?.map((g) => g!.node!)
				.map((p) => {
					return {
						label: p.name,
						name: p.name,
						value: p.id,
					};
				})
				.concat([
					{
						label: "Root Account",
						name: "Root Account",
						value: "QWNjb3VudEdyb3VwOnJvb3QtYWNjb3VudA==",
					},
				])}
			onChange={(e) => {
				updateField(e.value);
			}}
			filter={true}
			filterBy={"name"}
		/>
	);
};
export const SelectAccountGroupsSuspenseField = withFieldFallback(SelectAccountGroupsField);
