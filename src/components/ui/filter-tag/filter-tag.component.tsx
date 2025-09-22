import { Tooltip } from "primereact/tooltip";
import React from "react";
import { type FilterTagProps } from "./filter-tag.interface";
import { FilterTagFlex, FilterTagWrapper } from "./filter-tag.style";

export const FilterTag = ({ header, value, icon, tooltip, ...props }: FilterTagProps) => {
	const id = `filter-tag-${Math.floor(Math.random() * 1000)}`;
	const className = `${id} ${props.className || ""}`.trim();
	return (
		<>
			<Tooltip target={"." + className} />
			<FilterTagWrapper
				data-pr-tooltip={tooltip}
				data-pr-position="top"
				className={className}
				{...props}
			>
				<FilterTagFlex>
					<div style={{ fontSize: "0.5rem" }}>{header}</div>
					<div style={{ fontSize: "0.68rem" }}>{value}</div>
				</FilterTagFlex>
				{icon && <div className={icon}></div>}
			</FilterTagWrapper>
		</>
	);
};
