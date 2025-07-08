import styled from "styled-components";
import tw from "twin.macro";

export const Wrapper = styled.div<{ backgroundImage?: string }>`
	${(p) =>
		p.backgroundImage
			? `background-image: url(${p.backgroundImage});`
			: "background-color: #0169F8;"}
	${tw`h-full w-full flex items-center justify-center`}
`;
export const ModalWrapper = tw.div`w-full lg:w-[33.6%] bg-white rounded-lg py-12 px-14 flex flex-col gap-12`;
export const ModalHeader = tw.div`pb-4 flex justify-between`;
export const PageTitleWrapper = tw.div`flex flex-wrap gap-2`;
export const FlexColChild1 = tw.div`flex flex-col gap-3`;
export const FlexColChild2 = tw.div`flex flex-col gap-2`;
export const FlexColWith2Gap = tw.div`flex flex-col gap-8`;
