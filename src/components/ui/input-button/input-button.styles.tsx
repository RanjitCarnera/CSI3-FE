import styled from "styled-components";
import { borderColor, primary, white } from "@screens/skill-assessment/parts/mock/color";
import tw from "twin.macro";

export const Wrapper = styled.div<{ isSelected?: boolean }>`
	border-radius: 0.375rem;
	text-align: center;
	cursor: pointer;
	box-sizing: border-box;

	${(p) =>
		p.isSelected
			? `
				border: 2px solid transparent;
				background: ${primary.rgbaValue()};
				box-shadow: 0px 2px 0px 0px rgba(1, 105, 248, 0.40);
				`
			: `
				border: 2px solid ${borderColor.hexValue()};
				background: ${white.hexValue()};
				box-shadow: 0px 2px 0px 0px rgba(220, 223, 230, 0.40);
			`};

	${tw`p-5`}
`;

export const WrapperSm = styled(Wrapper)<{ isSelected?: boolean }>`
	${tw`p-5 py-[0.5rem] flex`}
	align-items: center;
	justify-content: center;
`;
