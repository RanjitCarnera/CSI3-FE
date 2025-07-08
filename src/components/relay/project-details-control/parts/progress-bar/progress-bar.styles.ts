import tw from "twin.macro";
import styled from "styled-components";
import { borderColor, primary } from "@screens/skill-assessment/parts/mock/color";

export const Wrapper = styled.div`
	border: 2px solid ${borderColor};
	border-radius: 5px;
	${tw`flex gap-[2px] p-[3px] w-[6rem]`}
`;

const BaseItem = tw.div`flex-1 py-[.5rem] rounded`;
export const VisibleItem = styled(BaseItem)`
	background-color: ${primary};
`;
export const InvisibleItem = tw(BaseItem)`bg-transparent`;
