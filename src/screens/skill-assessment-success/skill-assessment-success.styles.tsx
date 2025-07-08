import tw from "twin.macro";
import styled from "styled-components";

export const Wrapper = styled.div<{ backgroundImage?: string }>`
	${(p) =>
		p.backgroundImage
			? `background-image: url(${p.backgroundImage});`
			: "background-color: #0169F8;"}
	${tw`h-full w-full flex items-center justify-center overflow-auto pb-[6.5rem]`}
`;
export const ModalWrapper = styled.div`
	${tw`w-full lg:w-[41.6%] bg-white py-12 px-14 flex flex-col gap-12`}
	border-radius: 1rem;
`;
export const ContentWrapper = tw.div`flex gap-4 flex-col items-center text-center`;
