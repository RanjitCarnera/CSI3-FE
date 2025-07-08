import { Label, LabelOff, UnfoldLess, UnfoldMore } from "@mui/icons-material";
import { TooltipPosition } from "@thekeytechnology/epic-ui";
import { Tooltip } from "@thekeytechnology/framework-react-components";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { match } from "ts-pattern";
import { TkSelectButton } from "@components/ui/TkSelectButton";
import {
	selectAreGroupsExpanded,
	selectIsProjectsGroupedByTags,
	setAreGroupsExpanded,
	setProjectsIsGroupedByTags,
} from "@redux/ProjectViewSlice";
import {
	collapseAllId,
	groupedOrExpandAllId,
	unGroupedId,
} from "@screens/project-view/parts/projects-grid-part/parts/group-by-tags-button/group-by-tags-button.consts";

export const GroupByTagsButton = () => {
	const isGroupedByTags = useSelector(selectIsProjectsGroupedByTags);
	const areGroupsExpanded = useSelector(selectAreGroupsExpanded);
	const dispatch = useDispatch();

	const options = useMemo(() => {
		if (!isGroupedByTags) return [GroupByTagsOptions.ungrouped, GroupByTagsOptions.grouped];
		else
			return [
				GroupByTagsOptions.ungrouped,
				GroupedOptions.expandAll,
				GroupedOptions.collapseAll,
			];
	}, [isGroupedByTags]);

	const value: GroupByTagsOption | GroupedOption = useMemo(() => {
		if (!isGroupedByTags) return GroupByTagsOptions.ungrouped;
		if (areGroupsExpanded === true) return GroupedOptions.expandAll;
		else if (areGroupsExpanded === false) return GroupedOptions.collapseAll;
		if (isGroupedByTags) return GroupByTagsOptions.grouped;
		return GroupByTagsOptions.ungrouped;
	}, [isGroupedByTags, areGroupsExpanded]);

	const groupedOrExpandTooltip = useMemo(() => {
		if (options.length === 3) return "Expand all groups.";
		return "Grouped view.";
	}, [isGroupedByTags, options.length]);

	return (
		<div className={"group-by-tags-button-wrapper"} key={options.length}>
			<Tooltip
				target={unGroupedId}
				content={"Ungrouped view."}
				position={TooltipPosition.Top}
				key={options.length}
			/>
			<Tooltip
				target={groupedOrExpandAllId}
				content={groupedOrExpandTooltip}
				position={TooltipPosition.Top}
				key={groupedOrExpandTooltip}
			/>
			<Tooltip
				target={collapseAllId}
				content={"Collapse all groups."}
				position={TooltipPosition.Top}
			/>

			<TkSelectButton
				itemTemplate={(e) => {
					return match(e as GroupByTagsOption | GroupedOption)
						.with(GroupByTagsOptions.ungrouped, () => <LabelOff />)
						.with(GroupByTagsOptions.grouped, () => <Label />)
						.with(GroupedOptions.collapseAll, () => <UnfoldLess />)
						.with(GroupedOptions.expandAll, () => <UnfoldMore />)
						.exhaustive();
				}}
				value={value}
				options={options}
				onChange={(e) => {
					const value = e.value as GroupByTagsOption | GroupedOption;
					match(value)
						.with("ungrouped", () => {
							dispatch(setProjectsIsGroupedByTags(false));
						})
						.with("grouped", () => {
							dispatch(setProjectsIsGroupedByTags(true));
						})
						.with("expandAll", () => {
							dispatch(setAreGroupsExpanded(true));
						})
						.with("collapseAll", () => {
							dispatch(setAreGroupsExpanded(false));
						})
						.exhaustive();
				}}
			/>
		</div>
	);
};

const GroupByTagsOptions = {
	grouped: "grouped",
	ungrouped: "ungrouped",
} as const;
type GroupByTagsOption = (typeof GroupByTagsOptions)[keyof typeof GroupByTagsOptions];
const GroupedOptions = {
	expandAll: "expandAll",
	collapseAll: "collapseAll",
} as const;
type GroupedOptionsKeys = keyof typeof GroupedOptions;
type GroupedOption = (typeof GroupedOptions)[GroupedOptionsKeys];
