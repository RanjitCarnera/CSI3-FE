import { readInlineData, useRelayEnvironment } from "react-relay";
import { ValidatedFieldConfig } from "../../ui/ValidatedField";
import { MultiSelect } from "primereact/multiselect";
import { skillMultiSelect_Query } from "../../../__generated__/skillMultiSelect_Query.graphql";
import { fetchQuery } from "relay-runtime";
import { useEffect, useRef, useState } from "react";
import {
	skillMultiSelect_SkillFragment$data,
	skillMultiSelect_SkillFragment$key,
} from "../../../__generated__/skillMultiSelect_SkillFragment.graphql";
import { QUERY, SKILL_FRAGMENT } from "./skill-multi-select.graphql";

export const SkillMultiSelect = (fieldConfig: ValidatedFieldConfig<string[]>) => {
	const environment = useRelayEnvironment();
	const [visibleSkills, setVisibleSkills] = useState<skillMultiSelect_SkillFragment$data[]>([]);

	useEffect(() => {
		fetchQuery<skillMultiSelect_Query>(environment, QUERY, {})
			.toPromise()
			.then((result) => {
				setVisibleSkills(() =>
					result!.Skills.Skills.edges!.map((e) =>
						readInlineData<skillMultiSelect_SkillFragment$key>(
							SKILL_FRAGMENT,
							e!.node!,
						),
					),
				);
			});
		// eslint-disable-next-line
	}, []);

	const ref = useRef<HTMLDivElement>(null);

	return (
		<div className="flex flex-column">
			<div ref={ref} className="flex flex-column">
				<MultiSelect
					name={fieldConfig.fieldName}
					value={fieldConfig.fieldValue}
					disabled={fieldConfig.disabled}
					options={visibleSkills.map((p) => {
						return {
							label: p.name,
							name: p.name,
							value: p.id,
						};
					})}
					onChange={(e) => {
						fieldConfig.updateField(e.value);
					}}
					placeholder={
						fieldConfig.fieldValue
							?.map((v) => visibleSkills.find((skill) => skill.id === v)?.name)
							.join(", ") || fieldConfig.placeholder
					}
					filterBy={"name"}
					filter={true}
					fixedPlaceholder={true}
					onFilter={(e) => {
						fetchQuery<skillMultiSelect_Query>(environment, QUERY, {
							filterByName: e.filter?.length > 0 ? e.filter : undefined,
							alwaysIncludeIds:
								(fieldConfig.fieldValue?.length || 0) > 0
									? fieldConfig.fieldValue
									: undefined,
						})
							.toPromise()
							.then((result) => {
								setVisibleSkills(() =>
									result!.Skills.Skills.edges!.map((e) =>
										readInlineData<skillMultiSelect_SkillFragment$key>(
											SKILL_FRAGMENT,
											e!.node!,
										),
									),
								);
							});
					}}
				/>
			</div>
		</div>
	);
};
