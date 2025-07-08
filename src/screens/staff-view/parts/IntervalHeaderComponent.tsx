import { graphql } from "babel-plugin-relay/macro";
import moment from "moment-timezone";
import React from "react";
import { useSelector } from "react-redux";
import { useFragment } from "react-relay";
import styled from "styled-components";
import { match } from "ts-pattern";
import { TkSecondaryText } from "@components/ui/TkSecondaryText";
import { selectStaffViewFilters } from "@redux/StaffViewSlice";
import { type IntervalHeaderComponent_IntervalFragment$key } from "@relay/IntervalHeaderComponent_IntervalFragment.graphql";
import { COLUMN_WIDTH, HEADER_SIZE } from "@screens/staff-view/parts/staff-view.utils";

const INTERVAL_FRAGMENT = graphql`
	fragment IntervalHeaderComponent_IntervalFragment on IntervalDescription {
		startDate
		endDate
		fallsIntoCustomUtilizationWindow
	}
`;

interface OwnProps {
	intervalFragmentRef: IntervalHeaderComponent_IntervalFragment$key;
}

export const IntervalHeaderComponent = React.memo(({ intervalFragmentRef }: OwnProps) => {
	const interval = useFragment<IntervalHeaderComponent_IntervalFragment$key>(
		INTERVAL_FRAGMENT,
		intervalFragmentRef,
	);
	const filters = useSelector(selectStaffViewFilters);

	return (
		<TkSecondaryText
			className="flex flex-column"
			style={{
				minWidth: COLUMN_WIDTH,
				height: HEADER_SIZE,
			}}
		>
			{filters.intervalType === "Days" && (
				<>
					<DivWrapper
						hasHighlight={interval.fallsIntoCustomUtilizationWindow ?? undefined}
					>
						{moment(interval.startDate).format("M/D/YYYY") +
							match(moment(interval.startDate).day())
								.with(0, () => " SU")
								.with(6, () => " SA")
								.otherwise(() => "")}
					</DivWrapper>
				</>
			)}

			{(!filters.intervalType || filters.intervalType === "Weeks") && (
				<>
					<DivWrapper
						hasHighlight={interval.fallsIntoCustomUtilizationWindow ?? undefined}
					>
						{moment(interval.startDate).format("M/D/YYYY")}
					</DivWrapper>
				</>
			)}

			{filters.intervalType === "Months" && (
				<>
					<DivWrapper
						hasHighlight={interval.fallsIntoCustomUtilizationWindow ?? undefined}
					>
						{moment(interval.startDate).format("M/D/YYYY")}
					</DivWrapper>
				</>
			)}
			{filters.intervalType === "Quarters" && (
				<>
					<DivWrapper
						hasHighlight={interval.fallsIntoCustomUtilizationWindow ?? undefined}
					>
						{moment(interval.startDate).format("M/D/YYYY")}
					</DivWrapper>
				</>
			)}
		</TkSecondaryText>
	);
});
const DivWrapper = styled.div<{ hasHighlight?: boolean }>`
	color: ${({ hasHighlight }) => (hasHighlight ? "unset" : "unset")};
`;
