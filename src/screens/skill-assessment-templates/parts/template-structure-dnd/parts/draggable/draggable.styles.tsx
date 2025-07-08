import tw from "twin.macro";
import styled from "styled-components";

export const Wrapper = styled.div<{ isCategoryItem?: boolean }>`
	${(p) => (p.isCategoryItem ? "font-weight:bold;" : "")}
	${tw`flex gap-2 items-center cursor-move`}
`;
export const IconWrapper = tw.div`flex-grow-0`;
export const DeleteWrapper = tw.div`flex-grow-0 cursor-pointer`;
export const TextWrapper = tw.div`flex-1 text-left truncate`;
