import { Dropdown } from "primereact/dropdown";
import { useLazyLoadQuery } from "react-relay";
import { NOT_YET_IMPORTED_PROJECTS_FROM_RAND_QUERY } from "@components/project-from-rand-select/project-from-rand-select.graphql";
import { type projectFromRandSelect_Query } from "@relay/projectFromRandSelect_Query.graphql";
import { type ValidatedFieldConfig } from "../ui/ValidatedField";

export const ProjectFromRandSelect = (fieldConfig: ValidatedFieldConfig<string>) => {
	const query = useLazyLoadQuery<projectFromRandSelect_Query>(
		NOT_YET_IMPORTED_PROJECTS_FROM_RAND_QUERY,
		{},
		{ fetchPolicy: "network-only" },
	);

	return (
		<Dropdown
			name={fieldConfig.fieldName}
			value={fieldConfig.fieldValue}
			options={[
				{
					label: "None",
					name: "None",
					value: null,
				},
				...query.Rand.NotYetImportedProjectsFromRand.map((p) => {
					return {
						label: p.name,
						name: p.name,
						value: p.projectIdentifier,
					};
				}),
			]}
			onChange={(e) => {
				fieldConfig.updateField(e.value);
			}}
			filter={true}
			filterBy={"name"}
		/>
	);
};
