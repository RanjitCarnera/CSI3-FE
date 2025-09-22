import styled from "styled-components";
import tw from "twin.macro";
import { colors } from "@corestyle/color";

const BaseButtonWrapper = styled.div`
	color: ${colors.text};

	&:hover {
		color: ${colors.primary};
	}
`;
export const RosterButtonWrapper = styled(BaseButtonWrapper)`
	font-family: "Noto Sans", sans-serif;
	font-size: 14px;
	font-weight: 500;
	line-height: 24.5px;
	padding-left: 3.5px;
	${tw`flex justify-between flex-1 max-w-full`};
`;
export const AssignmentCardButtonWrapper = styled(RosterButtonWrapper)`
	${tw`font-bold`};
	color: ${colors.dark};
	cursor: pointer;

	&:hover {
		color: ${colors.dark};
	}
`;
export const SmallSpan = styled.div`
	font-size: 0.875rem;
	${tw`flex items-center gap-2`};
`;

export const NameWrapper = styled.div`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;

export const ExtraComponentWrapper = styled.div`
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
`;

export const A = styled.span`
	text-decoration: underline;
	color: var(--primary-color);
	text-underline: var(--primary-color);

	&:hover {
		cursor: pointer;
		pointer-events: unset;
	}
`;
