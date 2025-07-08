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
	${tw`flex justify-between flex-1 max-w-full`};
`;
export const AssignmentCardButtonWrapper = styled(RosterButtonWrapper)`
	${tw`font-bold`};
	color: ${colors.dark};
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
