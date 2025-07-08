import { Tag } from "primereact/tag";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useFragment } from "react-relay";
import { SkillMatrixTable } from "@components/relay/project-details-control/parts/table";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type projectDetailsControl_CategoryWithMatrixTypeInlineFragment$key } from "@relay/projectDetailsControl_CategoryWithMatrixTypeInlineFragment.graphql";
import { type projectDetailsControl_ProjectInScenarioFragment$key } from "@relay/projectDetailsControl_ProjectInScenarioFragment.graphql";
import {
	CATEGORY_WITH_MATRIX_TYPE_INLINE_FRAGMENT,
	PROJECT_IN_SCENARIO_FRAGMENT,
} from "./project-details-control.graphql";
import { type ProjectDetailsControlProps } from "./project-details-control.interface";
import { Header, ProjectImage } from "./project-details-control.styles";
import PersonImageSrc from "../../../assets/project.png";
import { AddressDisplay } from "../../ui/AddressDisplay";
import { ProjectDateTimeDisplay } from "../ProjectDateTimeDisplay";
import { SkillCategorySelect } from "../SkillCategorySelect";

export const ProjectDetailsControl = ({ projectFragmentRef }: ProjectDetailsControlProps) => {
	const { project } = useFragment<projectDetailsControl_ProjectInScenarioFragment$key>(
		PROJECT_IN_SCENARIO_FRAGMENT,
		projectFragmentRef,
	);

	const matricesWithCategories = project.skillMatrixByCategories.map((skillMatrixWithCategory) =>
		readInlineData<projectDetailsControl_CategoryWithMatrixTypeInlineFragment$key>(
			CATEGORY_WITH_MATRIX_TYPE_INLINE_FRAGMENT,
			skillMatrixWithCategory,
		),
	);

	const newCategoryIds = matricesWithCategories.map((e) => e.category?.id ?? "");
	const [categoryId, setCategoryId] = useState([...newCategoryIds].pop() ?? "");
	const matrixWithCategory = useMemo(
		() => matricesWithCategories.find((e) => e.category?.id === categoryId),
		[categoryId],
	);
	const hasPermissions = useSelector(selectHasPermissions);
	const hasPermission = hasPermissions(["UserInAccountPermission_Skills_Read"]);

	return (
		<div style={{ maxWidth: "50vw" }}>
			<Header className="mt-4 mb-4">{project.name}</Header>
			<div className="mb-4 flex">
				<div className="mr-3">
					<ProjectImage src={project.avatar?.url || PersonImageSrc} />
				</div>
				<div className="flex-grow-0 flex flex-column justify-content-between overflow-x-hidden">
					<div>
						{project.startDate && (
							<div className="small-text text-light">
								<i className="pi pi-calendar mr-2" />{" "}
								<ProjectDateTimeDisplay projectFragmentRef={project} />
							</div>
						)}
						{project.address && (
							<div className="small-text text-light">
								<i className="pi pi-building mr-2" />{" "}
								<AddressDisplay value={project.address} />
							</div>
						)}
					</div>
					<div
						className={
							"overflow-x-auto flex flex-nowrap gap-2 flex-grow-0 overflow-x-auto pb-2"
						}
					>
						{project.skills?.map((skill) => (
							<Tag value={skill.name} rounded style={{ whiteSpace: "nowrap" }} />
						))}
					</div>
				</div>
			</div>

			{hasPermission && (
				<div>
					<SkillCategorySelect
						fieldValue={categoryId}
						updateField={(e) => {
							setCategoryId(e || "");
						}}
						placeholder={"Select category"}
					/>
					<div className={"mb-2"}></div>
					{categoryId && <SkillMatrixTable matrixWithCategory={matrixWithCategory} />}
				</div>
			)}
		</div>
	);
};
