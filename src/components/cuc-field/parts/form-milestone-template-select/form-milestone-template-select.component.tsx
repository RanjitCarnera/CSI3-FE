import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { fetchQuery } from "relay-runtime";
import type { ValidatedFieldConfig } from "@components/ui/ValidatedField";
import {
	type formMilestoneTemplateSelect_MilestoneTemplateInlineFragment$data,
	type formMilestoneTemplateSelect_MilestoneTemplateInlineFragment$key,
} from "@relay/formMilestoneTemplateSelect_MilestoneTemplateInlineFragment.graphql";
import { type formMilestoneTemplateSelect_Query } from "@relay/formMilestoneTemplateSelect_Query.graphql";
import {
	MILESTONE_TEMPLATE_INLINE_FRAGMENT,
	QUERY,
} from "./form-milestone-template-select.graphql";

export const FormMilestoneTemplateSelect = ({
	alwaysExcludes,
	...fieldConfig
}: ValidatedFieldConfig<string> & { alwaysExcludes: string[] }) => {
	const environment = useRelayEnvironment();

	const [nodes, setNodes] = useState<
		formMilestoneTemplateSelect_MilestoneTemplateInlineFragment$data[]
	>([]);
	useEffect(() => {
		void fetchQuery<formMilestoneTemplateSelect_Query>(environment, QUERY, {})
			.toPromise()
			.then((result) => {
				setNodes(() =>
					result!.MilestoneTemplate.MilestoneTemplate.edges!.map((e) =>
						readInlineData<formMilestoneTemplateSelect_MilestoneTemplateInlineFragment$key>(
							MILESTONE_TEMPLATE_INLINE_FRAGMENT,
							e!.node!,
						),
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
				...nodes
					.map((p) => {
						return {
							label: p.data.name,
							value: p.id,
						};
					})
					.filter((p) => !alwaysExcludes.includes(p.value)),
			]}
			onChange={(e) => {
				fieldConfig.updateField(e.value);
			}}
			filter={true}
			filterBy={"label"}
			onFilter={(e) => {
				void fetchQuery<formMilestoneTemplateSelect_Query>(environment, QUERY, {
					filterByName: e.filter?.length > 0 ? e.filter : undefined,
				})
					.toPromise()
					.then((result) => {
						setNodes(() =>
							result!.MilestoneTemplate.MilestoneTemplate.edges!.map((e) =>
								readInlineData<formMilestoneTemplateSelect_MilestoneTemplateInlineFragment$key>(
									MILESTONE_TEMPLATE_INLINE_FRAGMENT,
									e!.node!,
								),
							),
						);
					});
			}}
		/>
	);
};
