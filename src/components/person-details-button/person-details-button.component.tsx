import { Button } from "@thekeytechnology/framework-react-components";
import React, { Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { useFragment } from "react-relay";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
	PERSON_FRAGMENT,
	SCENARIO_FRAGMENT,
	SCENARIO_UTILIZATION_FRAGMENT,
} from "@components/person-details-button/person-details-button.graphql";
import {
	A,
	AssignmentCardButtonWrapper,
	ExtraComponentWrapper,
	NameWrapper,
	RosterButtonWrapper,
	SmallSpan,
} from "@components/person-details-button/person-details-button.styles";
import {
	type PersonDetailsButtonProps,
	PersonDetailsButtonVariant,
} from "@components/person-details-button/person-details-button.types";
import { Loader } from "@components/ui/Loader";
import { TkDialog } from "@components/ui/TkDialog";
import { HarkinsTheme } from "@corestyle/component-theme/component-theme";
import { type personDetailsButton_ScenarioFragment$key } from "@relay/personDetailsButton_ScenarioFragment.graphql";
import { type personDetailsButton_ScenarioUtilizationFragment$key } from "@relay/personDetailsButton_ScenarioUtilizationFragment.graphql";
import { SETTINGS_PEOPLE_PATH } from "@screens/people/people.consts";
import { PersonDetailsModalContent } from "./parts/person-details-modal-content";
import { selectHasPermissions } from "../../redux/CurrentUserSlice";

export const PersonDetailsButton = ({
	personFragmentRef,
	scenarioFragmentRef,
	gapDaysOverride,
	afterNameSlot,
	hideTooltip,
	hideGapDays,
	variant = PersonDetailsButtonVariant.roster,
	scenarioUtilizationRef,
}: PersonDetailsButtonProps) => {
	const scenario = useFragment<personDetailsButton_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragmentRef,
	);
	const scenarioUtilization = useFragment<personDetailsButton_ScenarioUtilizationFragment$key>(
		SCENARIO_UTILIZATION_FRAGMENT,
		scenarioUtilizationRef,
	);
	const person = useFragment(PERSON_FRAGMENT, personFragmentRef);
	const gapDays = scenario.gapDays.personGapDays.find((g) => g.personRef === person.id);
	const utilization = scenarioUtilization?.personUtilizations.find(
		(g) => g.personRef === person.id,
	);
	const hasPermissions = useSelector(selectHasPermissions);
	const gapDaysEnabled = hasPermissions(["AccountPermission_Auth_GapDaysEnabled"]);

	let gapDaysText;
	if (gapDaysOverride) {
		gapDaysText = `${gapDaysOverride}`;
	} else if (gapDays?.gapDays) {
		gapDaysText = `${gapDays.gapDays}`;
	}

	const gapDaysComponent =
		gapDaysEnabled && gapDaysText ? (
			<ExtraComponentWrapper>
				<i className="pi pi-calendar text-xs" /> {gapDaysText}
			</ExtraComponentWrapper>
		) : null;

	const hasReadUtilizationPermission = hasPermissions([
		"UserInAccountPermission_Utilization_Read",
	]);

	const utilizationComponent =
		hasReadUtilizationPermission && utilization ? (
			<ExtraComponentWrapper>
				<i className="pi pi-chart-pie text-xs" />
				{(utilization.utilizationPercentage * 100).toFixed(2)}%
			</ExtraComponentWrapper>
		) : null;

	const tooltipGapDays = gapDaysEnabled
		? `${person.name} ${gapDaysOverride ?? gapDays?.gapDays ?? 0} gap days, `
		: "";
	const ButtonWrapper =
		variant === PersonDetailsButtonVariant.roster
			? RosterButtonWrapper
			: AssignmentCardButtonWrapper;

	const navigate = useNavigate();
	const [visible, setVisible] = useState(false);
	return (
		<>
			<ButtonWrapper
				onClick={() => {
					setVisible((boo) => !boo);
				}}
			>
				<NameWrapper>{person?.name}</NameWrapper>
				<SmallSpan>
					{afterNameSlot}
					{!hideGapDays && gapDaysEnabled ? gapDaysComponent : null}{" "}
					{utilizationComponent}
				</SmallSpan>
			</ButtonWrapper>
			<TkDialog
				dismissableMask={true}
				visible={visible}
				onHide={() => {
					setVisible((boo) => !boo);
				}}
				footer={
					<div className="flex justify-content-center">
						<Button
							onClick={() => {
								setVisible((boo) => !boo);
							}}
							content={{ label: "Cancel" }}
							inputVariant={"subtle"}
						/>
					</div>
				}
				header={
					<div>
						<A
							onClick={() => {
								navigate(SETTINGS_PEOPLE_PATH, {
									state: { personRef: person.id },
								});
							}}
						>
							{person.name}
						</A>
						{person.assignmentRole && (
							<span className="small-text ml-3">{person.assignmentRole.name}</span>
						)}
					</div>
				}
			>
				<Suspense fallback={<Loader />}>
					<PersonDetailsModalContent personId={person.id} scenarioId={scenario.id} />
				</Suspense>
			</TkDialog>
		</>

		// tooltip={{
		// 	content: hideTooltip
		// 		? undefined
		// 		: hasReadUtilizationPermission
		// 		? `${tooltipGapDays}${(
		// 				(utilization?.utilizationPercentage ?? 0) * 100
		// 		  ).toFixed(2)}% utilization`
		// 		: undefined,
		// }}
	);
};

const TemporaryTheme = {
	...HarkinsTheme,
	Button: {
		StyledButton: styled(HarkinsTheme.Button.StyledButton)`
			width: 100%;
			margin-left: 0.25rem;
		`,
	},
};
