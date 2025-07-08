import { Tooltip } from "@thekeytechnology/framework-react-components";
import { Column } from "primereact/column";
import React from "react";
import { ProgressBar } from "@components/relay/project-details-control/parts/progress-bar/progress-bar.component";
import { FlexCenter } from "@components/relay/project-details-control/parts/table/table.styles";
import { type projectDetailsControl_CategoryWithMatrixTypeInlineFragment$data } from "@relay/projectDetailsControl_CategoryWithMatrixTypeInlineFragment.graphql";
import { textDefault } from "@screens/skill-assessment/parts/mock/color";
import { LabelSpan } from "@screens/skill-assessment/parts/mock/typography";

export const getColumns = (
	matrixWithCategory: projectDetailsControl_CategoryWithMatrixTypeInlineFragment$data,
) => {
	return matrixWithCategory.matrix.columns.map((column, index) => {
		if (index === 0)
			return (
				<Column
					key={column.key}
					field={"name"}
					header={<LabelSpan color={textDefault}>{column.key}</LabelSpan>}
					className={"sticky left-0 z-4"}
					style={{ backgroundColor: "#f8f9fa" }}
				/>
			);
		return (
			<Column
				key={column.key}
				field={column.key}
				header={
					<div>
						<Tooltip
							target={"#header-" + index}
							content={column.key}
							position={"top"}
						/>
						<LabelSpan id={"header-" + index} color={textDefault}>
							{truncate(column.key)}
						</LabelSpan>
					</div>
				}
				style={{ whiteSpace: "nowrap", cursor: "pointer" }}
			/>
		);
	});
};

export const getRows = (
	matrix: projectDetailsControl_CategoryWithMatrixTypeInlineFragment$data,
): Array<Record<string, React.ReactNode>> => {
	return matrix.matrix.bodyRows.map((row) => {
		const name = row.key;
		const cells = row.entries.map((entry) => {
			const value =
				entry.value?.data.value.kind === "numerical"
					? entry.value?.data.value.number ?? 0
					: entry.value?.data.value.kind === "binary"
					? entry.value?.data.value.hasSkill
						? 1
						: 0
					: 0;
			const max =
				entry.value?.data.value.kind === "numerical"
					? entry.value?.data.skill?.dimension.dimensionCount ?? 0
					: 1;
			if (!entry.value?.data?.skill?.id) return [];

			const targetId = CSS.escape(entry.value?.id ?? "DUMMY");

			const jsx = (
				<FlexCenter>
					<Tooltip target={`#${targetId}`} content={`${value}/${max}`} />

					<ProgressBar value={value} max={max} id={targetId} />
				</FlexCenter>
			);
			const skillName = entry.value.data.skill.name;
			return [skillName, jsx];
		});
		return { name, ...Object.fromEntries(cells) };
	});
};

const truncate = (string: string, truncateLength = 20, truncateSuffix = "...") => {
	const needsTruncation = string.length > truncateLength;
	if (needsTruncation) return `${string.slice(0, truncateLength)}${truncateSuffix}`;

	return string;
};
