import styled from "styled-components";
import { borderColor, white } from "@screens/skill-assessment/parts/mock/color";
import tw from "twin.macro";

export const Wrapper = styled.div`
	position: absolute;
	bottom: 0;
	height: 6.5rem;
	width: 100%;
	background: ${white.hexValue()};

	border-top: 2px solid ${borderColor.hexValue()};
	background: ${white.hexValue()};
	box-shadow: 0px -6px 12px 0px rgba(161, 171, 187, 0.1);

	padding: 1.5rem 0rem;
	align-items: center;

	${tw`flex items-center justify-center`}
`;
export const ContentWrapper = styled.div`
	padding: 0rem 3.5rem;
	${tw`flex gap-6 w-full lg:w-[66.7%]`}
`;
export const ButtonWrapper = styled.div`
	flex-basis: 100%;
	${tw`flex flex-col`}
`;
