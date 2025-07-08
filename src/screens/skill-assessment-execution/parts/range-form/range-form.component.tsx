import React from "react";
import { RangeFormProps } from "./range-form.types";
import { InputButton } from "@components/ui/input-button";
import { ItemWrapper, Wrapper } from "./range-form.styles";

export const RangeForm = ({
	value,
	onChange,
	dimensionExplanations,
	dimensionCount,
	...props
}: RangeFormProps) => {
	const buildHandleOnClick = (i: number) => {
		return () => {
			onChange?.(i);
		};
	};

	return (
		<Wrapper style={{ gridTemplateColumns: `repeat(${dimensionCount},minmax(0,1fr))` }}>
			{new Array(dimensionCount).fill(undefined).map((e, i) => {
				const visibleValue = i + 1;
				return (
					<ItemWrapper>
						<InputButton
							isSelected={value === visibleValue}
							value={visibleValue + ""}
							onClick={buildHandleOnClick(visibleValue)}
							tooltip={dimensionExplanations?.[i]}
						/>
					</ItemWrapper>
				);
			})}
		</Wrapper>
	);
};
