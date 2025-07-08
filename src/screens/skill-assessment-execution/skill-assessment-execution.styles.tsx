import styled from "styled-components";
import tw from "twin.macro";

export const Wrapper = styled.div<{ backgroundImage?: string }>`
	${(p) =>
		p.backgroundImage
			? `background-image: url(${p.backgroundImage});`
			: "background-color: #0169F8;"}
	${tw`h-full w-full flex items-start justify-center pt-8 overflow-auto mb-8 pb-[6.5rem]`}
`;
export const ModalWrapper = tw.div`w-full lg:w-[66.7%] bg-white rounded-lg py-12 px-14 flex flex-col gap-8`;
export const ModalHeaderWrapper = tw.div`flex flex-col gap-2`;
export const ModalContent = tw.div`flex flex-col gap-8`;
export const AssessmentAndProgressWrapper = tw.div`flex justify-between items-end`;

export const TitleWrapper = tw.div`flex gap-2`;
