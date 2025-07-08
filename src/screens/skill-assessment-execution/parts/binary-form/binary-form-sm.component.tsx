import React, { useState } from "react";
import { BinaryFormSmProps } from "./binary-form.types";
import {
	ItemWrapper,
	Wrapper,
} from "@screens/skill-assessment-execution/parts/binary-form/binary-form.styles";
import { InputButtonSm } from "@components/ui/input-button";
import { BinaryInput } from "@screens/skill-assessment-execution/parts/binary-form/binary-form.component";
import { EditSkillAssociationModal } from "@components/relay/edit-skill-association-modal";

export const BinaryFormSm = ({
	value,
	onChange,
	personFragmentRef,
	skillAssociationFragmentRef,
	skillFragmentRef,
	...props
}: BinaryFormSmProps) => {
	const [isVisible, setIsVisible] = useState(false);
	const [valueClicked, setValueClicked] = useState<boolean>();
	const buildHandleOnClick = (input: BinaryInput) => {
		return () => {
			setValueClicked(input === BinaryInput.no ? false : true);
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
				updatedValue={{ kind: "binary", hasSkill: valueClicked ?? false }}
			/>
			<Wrapper>
				{["No", "Yes"].map((e, i) => (
					<ItemWrapper>
						<InputButtonSm
							isSelected={
								e === "Yes" && value === BinaryInput.yes
									? true
									: e === "No" && value === BinaryInput.no
									? true
									: false
							}
							value={e}
							onClick={buildHandleOnClick(
								e === "No" ? BinaryInput.no : BinaryInput.yes,
							)}
						/>
					</ItemWrapper>
				))}
			</Wrapper>
		</React.Fragment>
	);
};
