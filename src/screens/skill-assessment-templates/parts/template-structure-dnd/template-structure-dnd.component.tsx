import React, { useCallback, useMemo } from "react";
import { TemplateStructureDndProps } from "./template-structure-dnd.types";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { Draggable } from "@screens/skill-assessment-templates/parts/template-structure-dnd/parts/draggable";
import { Wrapper } from "@screens/skill-assessment-templates/parts/template-structure-dnd/template-structure-dnd.styles";
import { Skill } from "@components/relay/skill-multi-select-v2";

export const TemplateStructureDnd = ({
	skills,
	setSkills,
	onUpdate,
}: TemplateStructureDndProps) => {
	const skillsWithCategories = useMemo(() => {
		const grouped = skills.groupBy((e) => e.categoryId);
		const tbd = grouped
			.map((value) => {
				const categoryId = value.key;
				const categoriesSkills = value.value;
				return [
					{
						id: categoryId,
						name: [...categoriesSkills].shift()?.categoryName,
						categoryId: categoryId,
						isCategoryItem: true,
					} as Skill,
					...categoriesSkills,
				];
			})
			.flat()
			.filter((e) => e.name);

		return tbd.filter(
			(value, index, self) => index === self.findIndex((t) => t.id === value.id),
		);
	}, [skills]);

	const handleMoveSkill = useCallback(
		(dragIndex: number, hoverIndex: number) => {
			const handler = (dragIndex: number, hoverIndex: number, arr: Skill[]): Skill[] => {
				const entryBeingDragged = arr[dragIndex];
				const entryBeingDraggedOver = arr[hoverIndex];

				const haveSameCategory =
					entryBeingDragged.categoryId === entryBeingDraggedOver.categoryId;

				// switch places if same category
				if (haveSameCategory) {
					const tempArray = [...arr];
					tempArray[dragIndex] = entryBeingDraggedOver;
					tempArray[hoverIndex] = entryBeingDragged;
					const validIds = tempArray
						.filter((e) => !e.isCategoryItem)
						.map((e) => e.id ?? "");
					onUpdate(validIds);
					return tempArray;
				}

				// else switch all entries with same category as entryBeingDragged
				const dragItemCategoryEntries = arr.filter(
					(e) => e.categoryId === entryBeingDragged.categoryId,
				);
				const dragItemCategoryIndicies = dragItemCategoryEntries.map((e) =>
					arr.findIndex((b) => b.id === e.id),
				);

				// delete categories
				const newArr = [...arr];
				newArr.splice(
					[...dragItemCategoryIndicies].shift() ?? 0,
					dragItemCategoryIndicies.length,
				);
				const hoverItemCategoryEntries = newArr.filter(
					(e) => e.categoryId === entryBeingDraggedOver.categoryId,
				);

				const hoverItemCategoryIndices = hoverItemCategoryEntries.map((e) =>
					newArr.findIndex((b) => b.id === e.id),
				);
				newArr.splice(
					[...hoverItemCategoryIndices].shift() ?? 0,
					hoverItemCategoryIndices.length,
				);

				// add categories
				const [
					insertDragItemsIndex,
					insertHoverItemsInsert,
					[firstEntries, secondEntries],
				] =
					dragIndex > hoverIndex
						? [
								0,
								[...dragItemCategoryIndicies].length,
								[dragItemCategoryEntries, hoverItemCategoryEntries],
						  ]
						: [
								0,
								[...hoverItemCategoryIndices].length,
								[hoverItemCategoryEntries, dragItemCategoryEntries],
						  ];

				newArr.splice(insertDragItemsIndex, 0, ...firstEntries);
				newArr.splice(insertHoverItemsInsert, 0, ...secondEntries);

				onUpdate(newArr.filter((e) => !e.isCategoryItem).map((e) => e.id ?? ""));
				return newArr;
			};
			const newSkills = handler(dragIndex, hoverIndex, skillsWithCategories);
			setSkills(newSkills);
		},
		[skills],
	);

	const handleDeleteOnClick = useCallback(
		(id: string) => {
			const index = [...skills].findIndex((value) => value.id === id);
			const skillToBeDeleted = [...skills].find((value) => value.id === id);
			if (!skillToBeDeleted) {
				const newSkills = [...skills].filter((e) => e.categoryId !== id);
				setSkills(newSkills);
				onUpdate(newSkills.filter((e) => !e.isCategoryItem).map((e) => e.id ?? ""));
			} else {
				setSkills((prevSkills: Skill[]) => {
					const updatedSkills = update(prevSkills, {
						$splice: [[index, 1]],
					});
					onUpdate(updatedSkills.filter((e) => !e.isCategoryItem).map((e) => e.id ?? ""));
					return updatedSkills;
				});
			}
		},
		[skills],
	);

	const handleRenderDraggable = useCallback(
		(skill: Skill, index: number) => {
			return (
				<Draggable
					key={"draggable-" + index}
					index={index}
					id={skill.id ?? ""}
					text={skill.name ?? ""}
					onMove={handleMoveSkill}
					onDelete={handleDeleteOnClick}
					isCategoryItem={skill.isCategoryItem}
				/>
			);
		},
		[skills],
	);

	return (
		<Wrapper>
			<DndProvider backend={HTML5Backend}>
				{skillsWithCategories.map((skill, index) => handleRenderDraggable(skill, index))}
			</DndProvider>
		</Wrapper>
	);
};
