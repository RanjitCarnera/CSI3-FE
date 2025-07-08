import React, { useState } from "react";
import { useSelector } from "react-redux";
import { EditSkillAssociationModal } from "@components/relay/edit-skill-association-modal";
import { InputButtonSm } from "@components/ui/input-button";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { ItemWrapper, Wrapper } from "./range-form.styles";
import { type RangeFormSmProps } from "./range-form.types";

export const RangeFormSm = ({
	value,
	onChange,
	dimensionExplanations,
	dimensionCount,
	personFragmentRef,
	skillAssociationFragmentRef,
	skillFragmentRef,
	...props
}: RangeFormSmProps) => {
	const [valueClicked, setValueClicked] = useState<number>();
	const [isVisible, setIsVisible] = useState(false);
	const hasPermissions = useSelector(selectHasPermissions);
	const hasEditAccess = hasPermissions(["UserInAccountPermission_Skills_Edit"]);

	const buildHandleOnClick = (i: number) => {
		if (!hasEditAccess) return () => {};
		return () => {
			setValueClicked(i);
			setIsVisible((boo) => !boo);
		};
	};

	return (
		<React.Fragment>
			<EditSkillAssociationModal
				skillFragmentRef={skillFragmentRef}
				isVisible={isVisible}
				onHide={() => {
					setIsVisible((boo) => !boo);
				}}
				personFragmentRef={personFragmentRef}
				skillAssociationFragmentRef={skillAssociationFragmentRef}
				updatedValue={{ kind: "numerical", number: valueClicked ?? 1 }}
			/>

			<Wrapper style={{ gridTemplateColumns: `repeat(${dimensionCount},minmax(0,1fr))` }}>
				{new Array(dimensionCount).fill(undefined).map((e, i) => {
					const visibleValue = i + 1;
					return (
						<ItemWrapper>
							<InputButtonSm
								isSelected={value === visibleValue}
								value={visibleValue + ""}
								onClick={buildHandleOnClick(visibleValue)}
								tooltip={dimensionExplanations?.[i]}
							/>
						</ItemWrapper>
					);
				})}
			</Wrapper>
		</React.Fragment>
	);
};
