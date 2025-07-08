import React, { useContext } from "react";
import { CategoryFormProps } from "./category-form.types";
import { HeaderBoldSpan, HeaderSpan, PSpan } from "@screens/skill-assessment/parts/mock/typography";
import { textContrast, textSubtle } from "@screens/skill-assessment/parts/mock/color";
import {
	InnerWrapper,
	SkillHeaderWrapper,
	SkillWrapper,
	Spacing2,
	Spacing5,
	Wrapper,
} from "@screens/skill-assessment-execution/parts/category-form/category-form.styles";
import { BinaryForm, BinaryInput } from "@screens/skill-assessment-execution/parts/binary-form";
import { RangeForm } from "@screens/skill-assessment-execution/parts/range-form";

import { useFragment } from "react-relay";
import { ASSESSMENT_FRAGMENT } from "@screens/skill-assessment-execution/parts/category-form/category-form.graphql";

import { SkillAssessmentExecutionContext } from "@screens/skill-assessment-execution/skill-assessment-execution.context";
import { categoryForm_AssessmentFragment$key } from "@relay/categoryForm_AssessmentFragment.graphql";
import { NavigationMode } from "@screens/skill-assessment-execution/parts/navigation/navigation.consts";
import { NumericalSkillTooltipIcon } from "@screens/people/parts/edit-person-skill-associations-modal-content/parts/numerical-skill-tooltip-icon";

export const CategoryForm = ({ assessmentFragmentRef }: CategoryFormProps) => {
	const { formik, answer, accountId, assessmentId, navigationMode } = useContext(
		SkillAssessmentExecutionContext,
	);
	const assessment = useFragment<categoryForm_AssessmentFragment$key>(
		ASSESSMENT_FRAGMENT,
		assessmentFragmentRef,
	);
	const skillsToBeAssessedGroupedByCategory = [
		...(assessment?.template?.assessedSkills ?? []),
	]?.groupBy((e) => e.skillCategory?.name);

	const handleScroll = (
		categoryIndex: number,
		categoryArray: any[],
		skillIndex: number,
		skillArray: any[],
	) => {
		const isLastSkill = skillArray.length - 1 === skillIndex;
		if (isLastSkill) {
			const newCategory = categoryArray[categoryIndex + 1];

			if (!newCategory) return;
			return document
				.querySelector("#category-" + (categoryIndex + 1))
				?.scrollIntoView({ behavior: "smooth" });
		}
		document
			.querySelector(`#category-${categoryIndex}-${skillIndex + 1}`)
			?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<>
			{skillsToBeAssessedGroupedByCategory?.map((category, categoryIndex, categoryArray) => (
				<Wrapper id={"category-" + categoryIndex}>
					<HeaderBoldSpan color={textContrast}>{category.key}</HeaderBoldSpan>
					<InnerWrapper>
						{category.value.map((skill, skillIndex, skillArray) => {
							return (
								<SkillWrapper id={`category-${categoryIndex}-${skillIndex}`}>
									<SkillHeaderWrapper>
										<HeaderSpan color={textContrast}>{skill.name}</HeaderSpan>
										<NumericalSkillTooltipIcon skillFragmentRef={skill} />
									</SkillHeaderWrapper>
									<Spacing2 />
									<PSpan color={textSubtle}>{skill.description}</PSpan>
									<Spacing5 />
									{skill.dimension.kind === "numerical" ? (
										<RangeForm
											dimensionCount={skill.dimension.dimensionCount ?? 10}
											dimensionExplanations={
												skill.dimension.dimensionExplanations
													? [...skill.dimension.dimensionExplanations]
													: []
											}
											value={
												typeof formik?.values[skill.id]?.number === "number"
													? (formik?.values[skill.id]?.number as number)
													: undefined
											}
											onChange={(i) => {
												if (navigationMode === NavigationMode.read) return;

												answer?.({
													variables: {
														input: {
															accountId: accountId,
															assessmentId: assessmentId,
															skillAssessment: {
																skillId: skill.id,
																value: {
																	numerical: {
																		kind: "numerical",
																		number: i,
																	},
																},
															},
														},
													},
													onCompleted: () => {
														formik?.setFieldValue(skill.id, {
															kind: "numerical",
															number: i,
														});

														handleScroll(
															categoryIndex,
															categoryArray,
															skillIndex,
															skillArray,
														);
													},
												});
											}}
										/>
									) : skill.dimension.kind === "binary" ? (
										<BinaryForm
											value={
												formik?.values[skill.id]?.hasSkill === true
													? BinaryInput.yes
													: formik?.values[skill.id]?.hasSkill === false
													? BinaryInput.no
													: undefined
											}
											onChange={(e) => {
												if (navigationMode === NavigationMode.read) return;

												answer?.({
													variables: {
														input: {
															accountId: accountId,
															assessmentId: assessmentId,
															skillAssessment: {
																skillId: skill.id,
																value: {
																	binary: {
																		kind: "binary",
																		hasSkill:
																			e === BinaryInput.no
																				? false
																				: e ===
																				  BinaryInput.yes
																				? true
																				: false,
																	},
																},
															},
														},
													},
													onCompleted: () => {
														formik?.setFieldValue(
															skill.id,
															e === BinaryInput.no
																? {
																		hasSkill: false,
																		kind: "binary",
																  }
																: e === BinaryInput.yes
																? { hasSkill: true, kind: "binary" }
																: undefined,
														);
														handleScroll(
															categoryIndex,
															categoryArray,
															skillIndex,
															skillArray,
														);
													},
												});
											}}
										/>
									) : (
										<React.Fragment />
									)}
								</SkillWrapper>
							);
						})}
					</InnerWrapper>
				</Wrapper>
			))}
		</>
	);
};
