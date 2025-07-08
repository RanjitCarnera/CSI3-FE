import { Skeleton } from "primereact/skeleton";
import { classNames } from "primereact/utils";
import React from "react";
import { useSelector } from "react-redux";
import { useFragment } from "react-relay";
import {
	PERSON_FRAGMENT,
	SCENARIO_FRAGMENT,
	SCENARIO_UTILIZATION_FRAGMENT,
} from "@components/person-card/person-card.graphql";
import {
	PersonCardBaseStyles,
	UtilizationStatus,
} from "@components/person-card/person-card.styles";
import {
	type PersonCardProps,
	type PersonCardSkeletonProps,
} from "@components/person-card/person-card.types";
import { PersonDetailsButton } from "@components/person-details-button";
import { CommentIcon } from "@components/ui/CommentIcon";
import { CurrencyDisplay, CurrencyDisplayUtil } from "@components/ui/CurrencyDisplay";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import type { personCard_PersonFragment$key } from "@relay/personCard_PersonFragment.graphql";
import type { personCard_ScenarioFragment$key } from "@relay/personCard_ScenarioFragment.graphql";
import { type personCard_ScenarioUtilizationFragment$key } from "@relay/personCard_ScenarioUtilizationFragment.graphql";

export const PersonCard = React.forwardRef<any, PersonCardProps>(
	(
		{
			style,
			className,
			scenarioFragmentRef,
			personFragmentRef,
			gapDaysOverride,
			hideGapDays,
			hideTotalVolume,
			children,
			scenarioUtilizationRef,
		}: PersonCardProps,
		ref: any,
	) => {
		const { outerRef, innerRef } = (ref as any) || { outerRef: null, innerRef: null };
		const scenarioUtilization = useFragment<personCard_ScenarioUtilizationFragment$key>(
			SCENARIO_UTILIZATION_FRAGMENT,
			scenarioUtilizationRef,
		);
		const scenario = useFragment<personCard_ScenarioFragment$key>(
			SCENARIO_FRAGMENT,
			scenarioFragmentRef,
		);
		const person = useFragment<personCard_PersonFragment$key>(
			PERSON_FRAGMENT,
			personFragmentRef,
		);
		const hasPermissions = useSelector(selectHasPermissions);

		const hasReadUtilizationPermission = hasPermissions([
			"UserInAccountPermission_Utilization_Read",
		]);
		const utilization = hasReadUtilizationPermission
			? scenarioUtilization.personUtilizations.find(
					(utilization) => utilization.personRef === person.id,
			  )
			: undefined;

		return (
			<PersonCardBaseStyles
				ref={outerRef}
				style={style}
				className={classNames("border-1 border-transparent", className)}
			>
				<div ref={innerRef}>
					<PersonDetailsButton
						scenarioFragmentRef={scenario}
						personFragmentRef={person}
						gapDaysOverride={gapDaysOverride}
						hideGapDays={hideGapDays}
						afterNameSlot={
							person.comment ? (
								<CommentIcon className="ml-2" comment={person.comment} />
							) : null
						}
						scenarioUtilizationRef={scenarioUtilization}
					/>
					<div className="flex flex-row-reverse justify-content-between">
						<div>
							{!hideTotalVolume && (
								<CurrencyDisplay
									value={person.sumOfProjectVolume ?? 0}
									formatter={CurrencyDisplayUtil.formatter.million}
								/>
							)}
						</div>
						{person.assignmentRole && (
							<div className="roles text-base">
								<div key={"person" + person.id + "-role"} className="role pl-1">
									{person.assignmentRole.name}
								</div>
							</div>
						)}
					</div>
					{children}
				</div>
				{hasReadUtilizationPermission ? (
					<>
						{(!utilization || utilization.status === "NotAllocated") && (
							<UtilizationStatus className="not-assigned">
								Unassigned
							</UtilizationStatus>
						)}
						{utilization?.status === "Underallocated" && (
							<UtilizationStatus className="underallocated">
								Underallocated
							</UtilizationStatus>
						)}
						{utilization?.status === "Overallocated" && (
							<UtilizationStatus className="overallocated">
								Overallocated
							</UtilizationStatus>
						)}
					</>
				) : (
					<></>
				)}
			</PersonCardBaseStyles>
		);
	},
);

export const PersonCardSkeleton = ({ className, style }: PersonCardSkeletonProps) => {
	return (
		<PersonCardBaseStyles style={style} className={className}>
			<div>
				<Skeleton />
			</div>
		</PersonCardBaseStyles>
	);
};
