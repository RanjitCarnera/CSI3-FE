import styled from "styled-components";
import {
	LANE_ALLOCATION_BAR_HEIGHT,
	WITH_WEIGHTS_MODIFIER,
} from "@screens/staff-view/parts/staff-view.utils";
import { hexToRgb } from "@utils/color-conversion";
import { AllocationTypes } from "./allocation-bar.consts";
import { type AllocationType, type Stage } from "./allocation-bar.types";
import {
	getSecondaryTextColorFromCustomBackGroundColor,
	getTextColorFromCustomBackgroundColor,
} from "./allocation-bar.utils";

export const AllocationContainer = styled.div<{
	stage?: Stage;
	isGap: boolean;
	allocationType?: AllocationType;
	tagColor?: string;
	shouldUseTagColor?: boolean;
	showWeights?: boolean;
}>`
	background-color: ${(props) => {
		if (props.isGap || props.allocationType === AllocationTypes.unfilledAllocation)
			return "#FFF5F5";
		if (props.stage?.color) return props.stage.color;
		return "#EAEFFA";
	}};
	height: ${(p) => (p.showWeights ? WITH_WEIGHTS_MODIFIER : 1) * LANE_ALLOCATION_BAR_HEIGHT}px;
	width: 100%;
	display: flex;
	position: relative;
	align-items: start;
	padding-top: 7px;
	box-sizing: border-box;
	padding-left: 20px;
	border: ${(props) => {
		if (
			props.allocationType === AllocationTypes.unfilledAllocation &&
			props.shouldUseTagColor &&
			!!props.tagColor
		) {
			return `3px solid ${props.tagColor}`;
		}
		if (props.isGap || props.allocationType === AllocationTypes.unfilledAllocation)
			return "1px solid #FF1500";

		if (props.shouldUseTagColor && !!props.tagColor) {
			return `3px solid ${props.tagColor}`;
		} else {
			const hexBorderColor = getTextColorFromCustomBackgroundColor(props.stage?.color);
			const rgb = hexToRgb(hexBorderColor);

			if (!rgb) return `1px solid rgba(33, 76, 226, 0.6)`;
			return `1px solid rgba(${Object.values(rgb).join(", ")}, 0.6)`;
		}
	}};
	border-style: ${(props) => (props.isGap ? "dashed" : "solid")};

	.name-display {
		color: ${(props) => {
			if (props.isGap || props.allocationType === AllocationTypes.unfilledAllocation)
				return "#FF1500";
			return getTextColorFromCustomBackgroundColor(props.stage?.color);
		}};
	}

	@media print {
		-webkit-print-color-adjust: exact;
		color-adjust: exact;
	}

	:hover {
		opacity: 0.7;
	}
`;

export const AllocationBar = styled.div`
	display: flex;
	align-items: center;
	overflow: hidden;

	@media print {
		-webkit-print-color-adjust: exact;
		color-adjust: exact;
	}
`;

export const BarText = styled.div`
	font-size: 0.9rem;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

export const ProjectNameDisplay = styled.span`
	font-weight: 500;
	margin-right: 15px;
	white-space: nowrap;
`;

export const DateRangeDisplay = styled.span<{ stage: Stage; allocationType?: AllocationType }>`
	${(p) => {
		if (!p.stage?.color || p.allocationType === AllocationTypes.unfilledAllocation)
			return `color: #7d85a7;`;
		const color = getSecondaryTextColorFromCustomBackGroundColor(p?.stage?.color);
		return `color: ${color};`;
	}}
	min-width: 200px;
`;
