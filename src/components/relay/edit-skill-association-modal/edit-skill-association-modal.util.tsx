import { formatAssessmentValue } from "@components/person-details-button/parts/person-details-control/parts/skills-display/skills-display.util";
import { type SkillDimensionTypeEnum } from "@relay/PeopleTable_PersonFragment.graphql";
import {
	type BinaryAssessmentValueInput,
	type NumericalAssessmentValueInput,
} from "@relay/skillAssessmentExecution_AnswerAssessmentMutation.graphql";

export const enum SkillAssociationValueChangeStatus {
	increase = "increase",
	decrease = "decrease",
	noChange = "noChange",
}

export const calculateNumericalChangeStatus = ({
	previousNumber,
	updatedNumber,
}: {
	updatedNumber: number;
	previousNumber: number;
}): SkillAssociationValueChangeStatus => {
	const increase = previousNumber < updatedNumber;
	const decrease = previousNumber > updatedNumber;
	return increase
		? SkillAssociationValueChangeStatus.increase
		: decrease
		? SkillAssociationValueChangeStatus.decrease
		: SkillAssociationValueChangeStatus.noChange;
};
export const calculateBinaryChangeStatus = ({
	previousHasSkill,
	updatedHasSkill,
}: {
	previousHasSkill?: boolean;
	updatedHasSkill: boolean;
}): SkillAssociationValueChangeStatus => {
	const increase =
		(updatedHasSkill && previousHasSkill === false) || previousHasSkill === undefined;
	const decrease = !updatedHasSkill && previousHasSkill === true;
	return increase
		? SkillAssociationValueChangeStatus.increase
		: decrease
		? SkillAssociationValueChangeStatus.decrease
		: SkillAssociationValueChangeStatus.noChange;
};

export const getChangeText = ({
	personName,
	skillAssociationName,
	previousValue,
	updatedValue,
	changeStatus,
}: {
	personName: string;
	skillAssociationName: string;
	previousValue?: BinaryAssessmentValueInput | NumericalAssessmentValueInput;
	updatedValue: BinaryAssessmentValueInput | NumericalAssessmentValueInput;
	changeStatus: SkillAssociationValueChangeStatus;
}) => {
	if (changeStatus === SkillAssociationValueChangeStatus.noChange) {
		return (
			<div>
				Are you sure you want to clear <strong>{personName}'s</strong> skill{" "}
				<strong>{skillAssociationName}</strong> from{" "}
				{formatAssessmentValue({
					kind: previousValue?.kind as SkillDimensionTypeEnum | undefined,
					hasSkill: (previousValue as BinaryAssessmentValueInput | undefined)?.hasSkill,
					number: (previousValue as NumericalAssessmentValueInput | undefined)?.number,
				})}
			</div>
		);
	}
	return (
		<div>
			Are you sure you want to update <strong>{personName}`s</strong> skill{" "}
			<strong>{skillAssociationName}</strong> from{" "}
			{formatAssessmentValue({
				kind: previousValue?.kind as SkillDimensionTypeEnum | undefined,
				hasSkill: (previousValue as BinaryAssessmentValueInput | undefined)?.hasSkill,
				number: (previousValue as NumericalAssessmentValueInput | undefined)?.number,
			})}{" "}
			to{" "}
			<strong>
				{formatAssessmentValue({
					kind: updatedValue?.kind as SkillDimensionTypeEnum | undefined,
					hasSkill: (updatedValue as BinaryAssessmentValueInput)?.hasSkill,
					number: (updatedValue as NumericalAssessmentValueInput)?.number,
				})}
			</strong>
			?
		</div>
	);
};
