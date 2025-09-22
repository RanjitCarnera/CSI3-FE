import {
	Button,
	DialogButton,
	TkComponentsContext,
	Tooltip,
} from "@thekeytechnology/framework-react-components";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useFragment, useLazyLoadQuery, useMutation } from "react-relay";
import { Conditional } from "@components/conditional";
import { NavLink } from "@components/nav-link";
import { formatDate } from "@components/ui/DateTimeDisplay";
import { SuspenseDialogWithState } from "@components/ui/SuspenseDialogWithState";
import { TkButtonLink } from "@components/ui/TkButtonLink";
import { HarkinsTheme, SkillAssessmentTheme } from "@corestyle/component-theme/component-theme";

import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type editPersonSkillAssociationsModalContent_DisassociateSkillsByCategoryMutation } from "@relay/editPersonSkillAssociationsModalContent_DisassociateSkillsByCategoryMutation.graphql";
import { type editPersonSkillAssociationsModalContent_PersonFragment$key } from "@relay/editPersonSkillAssociationsModalContent_PersonFragment.graphql";
import { type editPersonSkillAssociationsModalContent_SetSkillAssociationExpirationDateInputMutation } from "@relay/editPersonSkillAssociationsModalContent_SetSkillAssociationExpirationDateInputMutation.graphql";
import { type editPersonSkillAssociationsModalContent_SkillInlineFragment$key } from "@relay/editPersonSkillAssociationsModalContent_SkillInlineFragment.graphql";
import { type editPersonSkillAssociationsModalContent_SkillsQuery } from "@relay/editPersonSkillAssociationsModalContent_SkillsQuery.graphql";
import {
	DISASSOCIATE_SKILLS_BY_CATEGORY_MUTATION,
	PERSON_FRAGMENT,
	SET_SKILL_ASSOCIATION_EXPIRATION_DATE_MUTATION,
	SKILL_INLINE_FRAGMENT,
	SKILLS_QUERY,
} from "@screens/people/parts/edit-person-skill-associations-modal-content/edit-person-skill-associations-modal-content.graphql";
import {
	CategoriesWrapper,
	CategoryItem,
	CategoryWrapper,
	CategoryWrapperMargin,
	SkillHeaderWrapper,
	SkillsWrapper,
	Wrapper,
} from "@screens/people/parts/edit-person-skill-associations-modal-content/edit-person-skill-associations-modal-content.styles";
import { type EditPersonSkillAssociationsModalContentProps } from "@screens/people/parts/edit-person-skill-associations-modal-content/edit-person-skill-associations-modal-content.types";
import { sanitizeHtmlId } from "@screens/people/parts/edit-person-skill-associations-modal-content/edit-person-skill-associations-modal-content.util";
import { EditExpirationDateForm } from "@screens/people/parts/edit-person-skill-associations-modal-content/parts/edit-expiration-date-form";
import { type editExpirationDateFormSchema } from "@screens/people/parts/edit-person-skill-associations-modal-content/parts/edit-expiration-date-form/edit-expiration-date-form.consts";
import { NumericalSkillTooltipIcon } from "@screens/people/parts/edit-person-skill-associations-modal-content/parts/numerical-skill-tooltip-icon";
import { textContrast, textDefault } from "@screens/skill-assessment/parts/mock/color";
import {
	ButtonSmSpan,
	HeaderBoldSpan,
	HeaderSpan,
	PageTitleSpan,
} from "@screens/skill-assessment/parts/mock/typography";
import { BinaryInput } from "@screens/skill-assessment-execution/parts/binary-form";
import { BinaryFormSm } from "@screens/skill-assessment-execution/parts/binary-form/binary-form-sm.component";
import { RangeFormSm } from "@screens/skill-assessment-execution/parts/range-form";

export const EditPersonSkillAssociationsModalContent = ({
	personFragmentRef,
}: EditPersonSkillAssociationsModalContentProps) => {
	const {
		Skills: {
			Skills: { edges: skillEdges },
		},
	} = useLazyLoadQuery<editPersonSkillAssociationsModalContent_SkillsQuery>(SKILLS_QUERY, {});

	const [deallocateByCategory] =
		useMutation<editPersonSkillAssociationsModalContent_DisassociateSkillsByCategoryMutation>(
			DISASSOCIATE_SKILLS_BY_CATEGORY_MUTATION,
		);

	const [commitExpirationDate] =
		useMutation<editPersonSkillAssociationsModalContent_SetSkillAssociationExpirationDateInputMutation>(
			SET_SKILL_ASSOCIATION_EXPIRATION_DATE_MUTATION,
		);
	const person = useFragment<editPersonSkillAssociationsModalContent_PersonFragment$key>(
		PERSON_FRAGMENT,
		personFragmentRef,
	);
	const personsSkills = person.skills?.edges?.map((e) => e!.node!);
	const allSkills = skillEdges!.map((e) =>
		readInlineData<editPersonSkillAssociationsModalContent_SkillInlineFragment$key>(
			SKILL_INLINE_FRAGMENT,
			e!.node!,
		),
	);

	const skillCategories = allSkills.map((s) => s.skillCategory).distinctBy((x) => x?.id);
	const skillsByCategory = [...allSkills].groupBy((x) => x.skillCategory?.id);
	const scrollWrapperRef = useRef<HTMLDivElement>(null);

	const createOnClickHandler = (id: string) => () => {
		const el = scrollWrapperRef.current?.querySelector("#" + sanitizeHtmlId(id));
		el?.scrollIntoView({ behavior: "smooth" });
	};

	const createClearSkillsOnClickHandler = (skillCategoryId?: string, callback?: () => void) => {
		return () => {
			if (!skillCategoryId) return;
			deallocateByCategory({
				variables: {
					input: {
						personId: person.id,
						categoryId: skillCategoryId,
					},
					connections: [person.skills.__id],
				},
				updater: (config) => {
					const skills = config.get(`client:${person.id}:__Person_skills_connection`);

					if (skills != null) {
						skills.invalidateRecord();
					}
				},
				onCompleted: () => {
					callback?.();
				},
			});
		};
	};

	const hasPermissions = useSelector(selectHasPermissions);
	const [selectedSkillAssociation, setSelectedSkillAssociation] = useState("");
	if (!skillCategories.length)
		return (
			<div>
				You have not defined any{" "}
				<NavLink to={"/settings/skills"}>attribute categories</NavLink>.
			</div>
		);
	const hasEditAccess = hasPermissions(["UserInAccountPermission_Skills_Edit"]);
	return (
		<TkComponentsContext.Provider value={SkillAssessmentTheme}>
			<Wrapper ref={scrollWrapperRef}>
				<CategoriesWrapper>
					{skillCategories.map((categoryIdAndName) => {
						return (
							<CategoryItem
								onClick={createOnClickHandler(categoryIdAndName?.id ?? "BAD_ID")}
							>
								<ButtonSmSpan>{categoryIdAndName?.name}</ButtonSmSpan>
								<TkComponentsContext.Provider value={HarkinsTheme}>
									{hasEditAccess && (
										<DialogButton
											tooltip={{ content: "Clear all", position: "bottom" }}
											buttonContent={{ icon: "pi pi-times" }}
											buttonVariant={"subtle"}
											buttonSize={"small"}
											title={`Clear All Skills in ${categoryIdAndName?.name}`}
											dialogFooter={(hide) => (
												<Button
													content={{ label: "Clear" }}
													onClick={createClearSkillsOnClickHandler(
														categoryIdAndName?.id,
														hide,
													)}
												/>
											)}
											children={() => (
												<div>
													This action is irreversible. It cannot not be
													undone.
												</div>
											)}
										/>
									)}
								</TkComponentsContext.Provider>
							</CategoryItem>
						);
					})}
				</CategoriesWrapper>
				<SkillsWrapper>
					{skillsByCategory.map((x) => {
						const skillCategory = skillCategories.find((c) => c?.id === x.key);
						if (!skillCategory) return <React.Fragment />;

						return (
							<CategoryWrapper key={x.key} id={sanitizeHtmlId(x.key ?? "")}>
								<HeaderBoldSpan color={textContrast}>
									{skillCategory.name}
								</HeaderBoldSpan>
								{x.value.map((skill) => {
									const personsSkill = personsSkills?.find(
										(s) => s.data?.skill?.id === skill.id,
									);
									const tooltipTarget = `expiration-date-edit-${skill?.id
										.replace("=", "")
										.replace("=", "")}`;
									return (
										<div key={skill.id}>
											<SkillHeaderWrapper>
												<HeaderSpan color={textContrast}>
													{skill.name}
												</HeaderSpan>
												<Conditional.Root
													condition={!!personsSkill?.data?.expirationDate}
												>
													<Conditional.Success>
														<div>
															(exp:{" "}
															{formatDate(
																personsSkill?.data?.expirationDate,
															)}
															)
														</div>
													</Conditional.Success>
												</Conditional.Root>
												<Conditional.Root condition={!!personsSkill}>
													<Conditional.Success>
														<Tooltip
															target={`#${tooltipTarget}`}
															content={
																<span>Edit expiration date</span>
															}
														/>
														<TkButtonLink
															id={tooltipTarget}
															icon="pi pi-calendar-times"
															iconPos="left"
															onClick={() => {
																setSelectedSkillAssociation(
																	personsSkill!.id,
																);
															}}
														/>
														<SuspenseDialogWithState<
															typeof editExpirationDateFormSchema,
															string
														>
															title={
																<PageTitleSpan color={textDefault}>
																	Edit expiration date
																</PageTitleSpan>
															}
															isVisible={
																selectedSkillAssociation ===
																personsSkill?.id
															}
															onHide={() => {
																setSelectedSkillAssociation("");
															}}
															formComponent={(ref, onHide) => {
																return (
																	<div>
																		<EditExpirationDateForm
																			ref={ref}
																			initialValues={{
																				expirationDate:
																					personsSkill
																						?.data
																						.expirationDate,
																			}}
																			onSubmit={(values) => {
																				commitExpirationDate(
																					{
																						variables: {
																							input: {
																								skillAssociationId:
																									selectedSkillAssociation,
																								expirationDateOpt:
																									values.expirationDate,
																							},
																						},
																						onCompleted:
																							() => {
																								onHide();
																							},
																					},
																				);
																			}}
																		/>
																	</div>
																);
															}}
														/>
													</Conditional.Success>
												</Conditional.Root>

												<NumericalSkillTooltipIcon
													skillFragmentRef={skill}
												/>
											</SkillHeaderWrapper>
											{skill.dimension.kind === "numerical" ? (
												<RangeFormSm
													dimensionExplanations={[
														...(skill.dimension.dimensionExplanations ??
															[]),
													]}
													dimensionCount={
														skill.dimension.dimensionCount ?? 10
													}
													value={personsSkill?.data?.value?.number}
													personFragmentRef={person}
													skillAssociationFragmentRef={personsSkill!}
													skillFragmentRef={skill}
												/>
											) : (
												<BinaryFormSm
													skillAssociationFragmentRef={personsSkill!}
													personFragmentRef={person}
													skillFragmentRef={skill}
													value={
														personsSkill?.data?.value?.hasSkill === true
															? BinaryInput.yes
															: personsSkill?.data?.value
																	?.hasSkill === false
															? BinaryInput.no
															: undefined
													}
												/>
											)}
										</div>
									);
								})}
								<CategoryWrapperMargin />
							</CategoryWrapper>
						);
					})}
				</SkillsWrapper>
			</Wrapper>
		</TkComponentsContext.Provider>
	);
};
