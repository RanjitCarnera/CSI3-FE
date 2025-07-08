import React, { PropsWithChildren, useId } from "react";
import { InputButtonProps } from "./input-button.types";
import { Wrapper } from "@components/ui/input-button/input-button.styles";
import { InputButtonTypography } from "@screens/skill-assessment/parts/mock/typography";
import { textContrast, white } from "@screens/skill-assessment/parts/mock/color";
import { Tooltip } from "@thekeytechnology/framework-react-components";

export const InputButton = ({ value, onClick, isSelected, tooltip }: InputButtonProps) => {
	const Typography = (props: PropsWithChildren) => (
		<InputButtonTypography color={isSelected ? white : textContrast}>
			{props.children}
		</InputButtonTypography>
	);
	const id = useId().replace(":", "").replace(":", "");
	return (
		<>
			<Tooltip content={tooltip} target={`#${id}`} />
			<Wrapper
				data-pr-tooltip={tooltip}
				data-pr-position="bottom"
				id={id}
				onClick={onClick}
				isSelected={isSelected}
			>
				<Typography>{value}</Typography>
			</Wrapper>
		</>
	);
};
