import { graphql } from "babel-plugin-relay/macro";
import { Dropdown } from "primereact/dropdown";
import { useLazyLoadQuery } from "react-relay";
import { type ProjectFromDynamicsSelect_Query } from "../../__generated__/ProjectFromDynamicsSelect_Query.graphql";
import { type ValidatedFieldConfig } from "../ui/ValidatedField";

const PROJECTS_QUERY = graphql`
	query ProjectFromDynamicsSelect_Query {
		Dynamics {
			NotYetImportedProjectsFromDynamics {
				id
				name
				projectIdentifier
			}
		}
	}
`;

export const ProjectFromDynamicsSelect = (fieldConfig: ValidatedFieldConfig<string>) => {
	const query = useLazyLoadQuery<ProjectFromDynamicsSelect_Query>(
		PROJECTS_QUERY,
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
				...query.Dynamics.NotYetImportedProjectsFromDynamics.map((p) => {
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
