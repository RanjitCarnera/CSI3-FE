import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { readInlineData, useFragment } from "react-relay";

import { NumberProgressBar } from "@components/person-details-button/parts/person-details-control/parts/skills-display/parts/progress-bar.component";
import {
	PERSON_FRAGMENT,
	SKILL_ASSOCIATION_INLINE_FRAGMENT,
} from "@components/person-details-button/parts/person-details-control/parts/skills-display/skills-display.graphql";
import {
	CategoriesWrapper,
	CategoryWrapper,
	HeaderWrapper,
	SkillsWrapper,
	SkillWrapper,
	Wrapper,
} from "@components/person-details-button/parts/person-details-control/parts/skills-display/skills-display.styles";
import { type SkillsDisplayProps } from "@components/person-details-button/parts/person-details-control/parts/skills-display/skills-display.types";
import {
	calculateMaxPointsInCategory,
	calculatePointsInCategory,
	skillAssociationToFormattedJsx,
} from "@components/person-details-button/parts/person-details-control/parts/skills-display/skills-display.util";
import { formatDate } from "@components/ui/DateTimeDisplay";
import { type skillsDisplay_PersonFragment$key } from "@relay/skillsDisplay_PersonFragment.graphql";
import { type skillsDisplay_SkillAssociationInlineFragment$key } from "@relay/skillsDisplay_SkillAssociationInlineFragment.graphql";
import { textContrast, textDefault } from "@screens/skill-assessment/parts/mock/color";
import { HeaderSpan, PlayerCardHeaderH3 } from "@screens/skill-assessment/parts/mock/typography";
import { isNumber } from "@screens/skill-assessment-execution/parts/progress-bar/progress-bar.util";

export const SkillsDisplay = ({ personFragmentRef }: SkillsDisplayProps) => {
	const [filter, setFilter] = useState("");
	const person = useFragment<skillsDisplay_PersonFragment$key>(
		PERSON_FRAGMENT,
		personFragmentRef,
	);

	const skillsOfPerson = (
		person.skills.edges?.map((e) =>
			readInlineData<skillsDisplay_SkillAssociationInlineFragment$key>(
				SKILL_ASSOCIATION_INLINE_FRAGMENT,
				e!.node!,
			),
		) || []
	).filter((s) => s.data.value.kind === "numerical" || s.data.value.kind === "binary");
	const categories = skillsOfPerson
		.map((s) => s.data.skill?.skillCategory)
		.distinctBy((e) => e?.id);

	const skillsByCategory = [...skillsOfPerson].groupBy((s) => s.data.skill?.skillCategory?.name);
	const [visibleSkillsByCategory, setVisibleSkillsByCategory] = useState<typeof skillsByCategory>(
		[...skillsByCategory],
	);

	const resetFilter = () => {
		setFilter("");
		setVisibleSkillsByCategory([...skillsByCategory]);
	};
	useEffect(() => {
		if (!filter) {
			setVisibleSkillsByCategory([...skillsByCategory]);
			return;
		}

		const filteredSkillsByCategory = [...skillsByCategory].filter(
			(category) => category.key?.toLowerCase().includes(filter),
		);
		setVisibleSkillsByCategory([...filteredSkillsByCategory]);
		// eslint-disable-next-line
	}, [filter]);

	const emptyMessage = <div>No skills found.</div>;
	const categorySearch = (
		<div className="flex w-full">
			<div className="p-input-icon-left flex">
				<i className="pi pi-search" />
				<InputText
					className={
						"flex-1" + categories.length && visibleSkillsByCategory.length === 0
							? "p-invalid"
							: ""
					}
					value={filter}
					onChange={(e) => {
						setFilter(e.currentTarget.value.toLowerCase());
					}}
					placeholder={"Filter by category"}
				/>
			</div>
			<Button className={"flex-grow-0"} icon={"pi pi-times"} onClick={resetFilter} />
		</div>
	);

	return (
		<Wrapper>
			{skillsByCategory.length ? categorySearch : emptyMessage}
			<CategoriesWrapper>
				{visibleSkillsByCategory.map((skillsInCategory) => {
					const points = calculatePointsInCategory(skillsInCategory.value);
					const max = calculateMaxPointsInCategory(skillsInCategory.value);
					const percentage = points / max;
					const text = isNumber(percentage) ? `${Math.round(percentage * 100)}` : "N/A";
					return (
						<CategoryWrapper key={skillsInCategory.key}>
							<HeaderWrapper>
								<NumberProgressBar value={text} percentage={percentage * 100} />
								<PlayerCardHeaderH3 color={textContrast}>
									{skillsInCategory.key}
								</PlayerCardHeaderH3>
							</HeaderWrapper>
							<SkillsWrapper>
								{skillsInCategory.value.map((skill) => {
									const formattedValue = skillAssociationToFormattedJsx(skill);
									return (
										<SkillWrapper key={skill.id}>
											{formattedValue}
											<HeaderSpan color={textDefault}>
												{skill.data.skill?.name}
												{skill.data?.expirationDate
													? " (exp - " +
													  formatDate(skill.data?.expirationDate) +
													  ")"
													: ""}
											</HeaderSpan>
										</SkillWrapper>
									);
								})}
							</SkillsWrapper>
						</CategoryWrapper>
					);
				})}
			</CategoriesWrapper>
		</Wrapper>
	);
};
