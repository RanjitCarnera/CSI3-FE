import { CheckCircle, RestartAlt, UnfoldLess, UnfoldMore } from "@mui/icons-material";
import { type AnyAction } from "@reduxjs/toolkit";
import { TooltipPosition } from "@thekeytechnology/epic-ui";
import { Tooltip } from "@thekeytechnology/framework-react-components";
import React, { type Dispatch } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, type UseMutationConfig } from "react-relay";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import {
	type AssignmentWeightForInterval,
	selectChangedAssignmentWeightsForIntervals,
	selectShowWeights,
	selectStaffViewFilters,
	setChangedAssignmentWeightsForInterval,
	setShowWeights,
} from "@redux/StaffViewSlice";
import { type intervalWeightsButton_SetAssignmentWeightsForIntervalMutation } from "@relay/intervalWeightsButton_SetAssignmentWeightsForIntervalMutation.graphql";
import { type IntervalType } from "@relay/staffViewPart_Query.graphql";
import { SET_ASSIGNMENT_WEIGHTS_FOR_INTERVAL_MUTATION } from "@screens/staff-view/parts/interval-weights-button/interval-weights-button.graphql";
import { SelectButtonBuilder } from "@utils/select-button-builder.utils";
import { firstChildId, secondChildId, thirdChildId } from "./interval-weights-button.consts";

const Options = {
	show: "show",
	hide: "hide",
	submit: "submit",
	reset: "reset",
} as const;
type Kind = keyof typeof Options;

interface State {
	isShowing: boolean;
	changedAssignmentWeights: AssignmentWeightForInterval[];
	dispatch: Dispatch<AnyAction>;
	commit: (
		config: UseMutationConfig<intervalWeightsButton_SetAssignmentWeightsForIntervalMutation>,
	) => any;
	intervalType: IntervalType;
	scenarioId: string;
}

interface Props {
	scenarioId: string;
}

class IntervalWeightsButtonBuilder extends SelectButtonBuilder<Kind, State, Props> {
	protected getExtra(state: State): React.ReactNode {
		const options = this.getOptions(state);
		const firstTooltipContent = options.length === 3 ? "Hide weights." : "Show weights.";
		const secondTooltipContent = options.length === 3 ? "Submit weights." : "Hide weights.";

		return (
			<>
				<Tooltip
					target={firstChildId}
					content={firstTooltipContent}
					position={TooltipPosition.Top}
					key={options.length}
				/>
				<Tooltip
					target={secondChildId}
					content={secondTooltipContent}
					position={TooltipPosition.Top}
					key={firstTooltipContent}
				/>
				<Tooltip
					target={thirdChildId}
					content={"Reset changed weights."}
					position={TooltipPosition.Top}
				/>
			</>
		);
	}

	protected override getItemTemplate(state: State): (kind: Kind) => React.ReactNode {
		return function (p1: Kind) {
			return match(p1)
				.with(Options.hide, () => <UnfoldLess />)
				.with(Options.show, () => <UnfoldMore />)
				.with(Options.submit, () => <CheckCircle style={{ fill: "limegreen" }} />)
				.with(Options.reset, () => <RestartAlt />)
				.exhaustive();
		};
	}

	protected override getOnChange(state: State): (e?: Kind | null) => void {
		return function (p1?: Kind | null) {
			match(p1)
				.with(Options.reset, () => {
					state.dispatch(setChangedAssignmentWeightsForInterval([]));
					toast.warn("Reset changed weights.");
				})
				.with(Options.submit, () => {
					if (!state.changedAssignmentWeights.length) return;

					if (state.intervalType === "Days") {
						toast.warn("Cannot change weights for days.");
						return;
					}
					state.commit({
						variables: {
							input: {
								scenarioId: state.scenarioId,
								data: state.changedAssignmentWeights.map((e) => ({
									weight: e.weight!,
									assignmentRef: e.assignmentRef,
									intervalIndex: e.intervalIndex,
								})),
								intervalType: state.intervalType,
							},
						},
						onCompleted: () => {
							toast.success("Changed weights for interval");
							state.dispatch(setChangedAssignmentWeightsForInterval([]));
							location.reload();
						},
					});
				})
				.with(Options.show, () => {
					state.dispatch(setShowWeights(true));
				})
				.with(Options.hide, () => {
					state.dispatch(setShowWeights(false));
				})
				.with(null, () => {})
				.with(undefined, () => {})
				.exhaustive();
		};
	}

	protected override getOptions(state: State): Kind[] {
		return !state.isShowing
			? [Options.show, Options.hide]
			: [Options.hide, Options.submit, Options.reset];
	}

	protected override getValue(state: State): Kind | null {
		if (!state.isShowing) return Options.hide;
		else if (state.isShowing && !state.changedAssignmentWeights?.length) return Options.reset;
		else return Options.show;
	}

	protected override useState(): (props: Props) => State {
		return (props) => {
			const isShowing = useSelector(selectShowWeights);
			const changedAssignmentWeights = useSelector(
				selectChangedAssignmentWeightsForIntervals,
			);
			const intervalType = useSelector(selectStaffViewFilters).intervalType;
			const dispatch = useDispatch();
			const [commit] =
				useMutation<intervalWeightsButton_SetAssignmentWeightsForIntervalMutation>(
					SET_ASSIGNMENT_WEIGHTS_FOR_INTERVAL_MUTATION,
				);
			return {
				dispatch,
				changedAssignmentWeights,
				isShowing,
				commit,
				intervalType,
				scenarioId: props.scenarioId,
			};
		};
	}

	protected override className = "interval-weights-button";
}

export const IntervalWeightsButton = new IntervalWeightsButtonBuilder().build();
