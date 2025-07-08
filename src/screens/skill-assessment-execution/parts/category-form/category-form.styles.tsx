import tw from "twin.macro";
import styled from "styled-components";
import { textSubtle } from "@screens/skill-assessment/parts/mock/color";

export const Wrapper = tw.div`flex flex-col gap-5`;
export const InnerWrapper = tw.div`p-6 flex flex-col gap-8`;
export const SkillWrapper = tw.div``;
export const SkillHeaderWrapper = tw.div`flex items-center gap-2`;
export const Spacing2 = tw.div`h-2`;
export const Spacing5 = tw.div`h-5`;

export const TooltipIndex = tw.strong``;
export const TooltipDelimiter = styled.span`
	color: ${textSubtle};
`;
export const TooltipWrapper = tw.div`flex flex-col gap-6`;
export const TooltipItemWrapper = tw.div`flex gap-2`;
