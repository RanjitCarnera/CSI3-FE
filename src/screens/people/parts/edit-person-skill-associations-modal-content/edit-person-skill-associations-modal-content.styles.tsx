import styled from "styled-components";
import tw from "twin.macro";

export const Wrapper = tw.div`flex overflow-auto max-h-[50vh]`;
export const CategoriesWrapper = styled.div`
	${tw`flex-1 flex flex-col gap-[1.25rem ] sticky top-[0]`}
	align-self: flex-start;
`;
export const SkillsWrapper = tw.div`flex-[2] flex flex-col gap-[1.5rem]`;

export const CategoryItem = tw.div`cursor-pointer flex flex-nowrap items-center gap-2`;
export const CategoryWrapper = tw.div`flex flex-col gap-[1.5rem] `;
export const CategoryWrapperMargin = tw.div`h-[1.5rem]`;
export const SkillHeaderWrapper = tw.div`flex items-center gap-2`;
