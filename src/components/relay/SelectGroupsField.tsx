import { graphql } from "babel-plugin-relay/macro";
import { MultiSelect } from "primereact/multiselect";
import React from "react";
import { useLazyLoadQuery } from "react-relay";
import { withFieldFallback } from "@components/field";
import { type SelectGroupsField_Query } from "../../__generated__/SelectGroupsField_Query.graphql";
import { type ValidatedFieldConfig } from "../ui/ValidatedField";

const QUERY = graphql`
	query SelectGroupsField_Query {
		Management {
			Groups(first: 50) {
				edges {
					node {
						id
						name
					}
				}
			}
		}
	}
`;

export const SelectGroupsField = ({
	fieldValue,
	fieldName,
	updateField,
}: ValidatedFieldConfig<string[]>) => {
	const {
		Management: {
			Groups: { edges: groups },
		},
	} = useLazyLoadQuery<SelectGroupsField_Query>(QUERY, {});

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
				})}
			onChange={(e) => {
				updateField(e.value);
			}}
			filter={true}
			filterBy={"name"}
		/>
	);
};

export const SelectGroupsSuspenseField = withFieldFallback(SelectGroupsField);
