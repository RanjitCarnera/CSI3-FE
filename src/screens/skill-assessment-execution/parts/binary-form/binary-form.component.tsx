import React from "react";
import { BinaryFormProps } from "./binary-form.types";

import { InputButton } from "@components/ui/input-button";
import {
	ItemWrapper,
	Wrapper,
} from "@screens/skill-assessment-execution/parts/binary-form/binary-form.styles";

export enum BinaryInput {
	yes,
	no,
}
export const BinaryForm = ({ value, onChange, ...props }: BinaryFormProps) => {
	const buildHandleOnClick = (input: BinaryInput) => {
		return () => {
			onChange?.(input);
		};
	};
	return (
		<Wrapper>
			{["No", "Yes"].map((e, i) => (
				<ItemWrapper>
					<InputButton
						isSelected={
							e === "Yes" && value === BinaryInput.yes
								? true
								: e === "No" && value === BinaryInput.no
								? true
								: false
						}
						value={e}
						onClick={buildHandleOnClick(e === "No" ? BinaryInput.no : BinaryInput.yes)}
					/>
				</ItemWrapper>
			))}
		</Wrapper>
	);
};
