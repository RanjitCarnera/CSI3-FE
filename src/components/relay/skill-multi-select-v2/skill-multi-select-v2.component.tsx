import { readInlineData, useRelayEnvironment } from "react-relay";
import { ValidatedFieldConfig } from "../../ui/ValidatedField";

import { fetchQuery } from "relay-runtime";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { QUERY, SKILL_FRAGMENT } from "./skill-multi-select-v2.graphql";
import { skillMultiSelectV2_Query } from "@relay/skillMultiSelectV2_Query.graphql";
import {
	skillMultiSelectV2_SkillFragment$data,
	skillMultiSelectV2_SkillFragment$key,
} from "@relay/skillMultiSelectV2_SkillFragment.graphql";
import { TemplateStructureDnd } from "@screens/skill-assessment-templates/parts/template-structure-dnd";
import { TreeNode } from "@thekeytechnology/framework-react-components";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";

export type Skill = {
	id?: string;
	name?: string;
	categoryId?: string;
	categoryName?: string;
	isCategoryItem?: boolean;
};
export const SkillMultiSelectV2 = (fieldConfig: ValidatedFieldConfig<string[]>) => {
	const environment = useRelayEnvironment();
	const [filterValue, setFilterValue] = useState("");
	const [visibleSkills, setVisibleSkills] = useState<skillMultiSelectV2_SkillFragment$data[]>([]);
	const visibleTreeNodes = useMemo(() => {
		const groupedByCategory = visibleSkills.groupBy((e) => e.skillCategory?.id);
		return groupedByCategory.map(
			(category, categoryIndex) =>
				({
					key: categoryIndex + "",
					label: [...category.value].shift()?.skillCategory?.name,
					categoryId: [...category.value].shift()?.skillCategory?.id,
					children: category.value.map(
						(skill, skillIndex) =>
							({
								key: categoryIndex + "-" + skillIndex,
								label: skill.name,
								data: {
									name: skill.name,
									id: skill.id,
									categoryId: skill.skillCategory?.id,
									categoryName: skill.skillCategory?.name,
									isCategoryItem: false,
								},
							}) as TreeNode<Skill>,
					),
				}) as TreeNode<Skill>,
		);
	}, [visibleSkills]);
	const [selectedVisibleTreeNodes, setSelectedVisibleTreeNodes] = useState<any>();
	const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
	useEffect(() => {
		fetchQuery<skillMultiSelectV2_Query>(environment, QUERY, {})
			.toPromise()
			.then((result) => {
				setVisibleSkills(() =>
					result!.Skills.Skills.edges!.map((e) =>
						readInlineData<skillMultiSelectV2_SkillFragment$key>(
							SKILL_FRAGMENT,
							e!.node!,
						),
					),
				);
			});
		// eslint-disable-next-line
	}, []);

	const ref = useRef<HTMLDivElement>(null);
	const handleOnChange = (e: TreeSelectChangeEvent) => {
		try {
			const entries = Object.entries(e.value as Record<string, any>);
			const filteredEntries = entries.filter(([key]) => {
				return key.includes("-");
			});
			const skillIdKeys = filteredEntries.map(([key]) => key);
			const skillTreeNodes = Object.values(visibleTreeNodes)
				.map((cat) => cat.children)
				.flat();
			const selectedTreeNodes = skillTreeNodes
				.filter((node) => skillIdKeys.includes(node?.key as string))
				.filter((e) => e !== undefined);

			const selectedIds = selectedTreeNodes.map((e) => e?.data?.id);
			fieldConfig.updateField(selectedIds as string[]);
		} catch (e) {}
	};

	useEffect(() => {
		const tbd = [...(fieldConfig.fieldValue ?? [])]?.map((id) => {
			const treeNode = visibleTreeNodes
				.map((e) => e.children)
				.flat()
				.find((e) => e?.data?.id === id);
			if (!treeNode) return;

			const checked = true;
			const partialChecked = false;
			const selectedVisibleTreeNode = {
				[treeNode?.key ?? ""]: {
					checked,
					partialChecked,
				},
			};

			const selectedSkill = treeNode.data;

			return {
				id,
				selectedVisibleTreeNode,
				selectedSkill,
			};
		});

		const transformedObject = tbd.reduce(
			(result, item) => {
				if (!item) return result;
				const { id, selectedVisibleTreeNode, selectedSkill } = item;

				result.ids.push(id);
				result.selectedVisibleTreeNodes.push(selectedVisibleTreeNode);
				result.selectedSkills.push(selectedSkill);

				return result;
			},
			{
				ids: [] as string[],
				selectedVisibleTreeNodes: [] as {
					[x: string]: { checked: boolean; partialChecked: boolean };
				}[],
				selectedSkills: [] as (Skill | undefined)[],
			},
		);

		const categorySelectedTreeNodes = visibleTreeNodes
			.map((category) => {
				const childrenKeys = category.children?.map((e) => e.key);
				const selectedKeys = transformedObject.selectedVisibleTreeNodes
					.map((e) => Object.keys(e))
					.flat();

				const checked = childrenKeys?.length
					? childrenKeys?.every((e) => (e ? selectedKeys.includes(e as string) : false))
					: false;
				const partialChecked =
					checked === true
						? false
						: childrenKeys?.some((e) =>
								e ? selectedKeys.includes(e as string) : false,
						  );

				if (checked === false && partialChecked === false && !category?.children?.length) {
					return undefined;
				}

				return {
					[category.key ?? ""]: {
						checked,
						partialChecked,
					},
				};
			})
			.filter((e) => e !== undefined);

		setSelectedSkills(transformedObject.selectedSkills as Skill[]);
		const allSelectedVisibleTreeNodes = [
			...transformedObject.selectedVisibleTreeNodes,
			...categorySelectedTreeNodes,
		];
		const transformedSelectedVisibleTreeNodes = allSelectedVisibleTreeNodes.reduce(
			(result, currentItem) => {
				if (!currentItem) return result;
				if (!result) return {};

				const keys = Object.keys(currentItem);
				keys.forEach((key) => {
					result[key] = currentItem[key];
				});
				return result;
			},
			{},
		);

		setSelectedVisibleTreeNodes(transformedSelectedVisibleTreeNodes);
	}, [fieldConfig.fieldValue, visibleTreeNodes]);
	const handleOnDelete = (e?: string[]) => {
		fieldConfig.updateField(e);
	};
	return (
		<div className="flex flex-column">
			<TemplateStructureDnd
				skills={selectedSkills}
				setSkills={setSelectedSkills}
				onUpdate={handleOnDelete}
			/>
			<div ref={ref} className="flex flex-column">
				<TreeSelect
					name={fieldConfig.fieldName}
					value={selectedVisibleTreeNodes}
					disabled={fieldConfig.disabled}
					options={visibleTreeNodes}
					onChange={handleOnChange}
					placeholder={
						fieldConfig.fieldValue
							?.map((v) => visibleSkills.find((skill) => skill.id === v)?.name)
							.join(", ") || fieldConfig.placeholder
					}
					filterBy={"label"}
					filter={true}
					selectionMode={"checkbox"}
					metaKeySelection={false}
					display={"chip"}
					filterValue={filterValue}
					onFilterValueChange={(e) => {
						setFilterValue(e.value);
						fetchQuery<skillMultiSelectV2_Query>(environment, QUERY, {
							filterByName: e.value?.length > 0 ? e.value : undefined,
							alwaysIncludeIds:
								(fieldConfig.fieldValue?.length || 0) > 0
									? fieldConfig.fieldValue
									: undefined,
						})
							.toPromise()
							.then((result) => {
								setVisibleSkills(() =>
									result!.Skills.Skills.edges!.map((e) =>
										readInlineData<skillMultiSelectV2_SkillFragment$key>(
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
