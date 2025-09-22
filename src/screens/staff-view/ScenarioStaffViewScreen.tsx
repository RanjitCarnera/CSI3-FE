import { Button } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import { OverlayPanel } from "primereact/overlaypanel";
import { Panel } from "primereact/panel";
import React, {
	Suspense,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	useTransition,
} from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";
import { useFragment, useLazyLoadQuery } from "react-relay";
import { useMatch } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { LoadPursuitProjectsFromRandDwhButton } from "@components/load-pursuit-projects-from-rand-dwh-button";
import { CheckScenarioPermissions } from "@components/relay/CheckScenarioPermissions";
import { DashboardHeader } from "@components/relay/DashboardHeader";
import { SyncWithRandPreconDwhButton } from "@components/sync-with-rand-precon-dwh-button";
import { BaseScreen } from "@components/ui/base-screen";
import { FilterViewSelector } from "@components/ui/FilterViewSelector";
import { TkButton } from "@components/ui/TkButton";
import { UpdateAssignmentsFromDynamicsButton } from "@components/update-assignments-from-dynamics-button";
import { selectCurrentUser } from "@redux/CurrentUserSlice";
import {
	initializeFromDefaultView,
	initializeFromPreferredView,
	selectShouldSeeUseTagColorButton,
	selectShouldUseTagColor,
	selectShowWeights,
	selectStaffViewFilters,
	setShouldUseTagColor,
} from "@redux/StaffViewSlice";
import { type ScenarioStaffViewScreen_Query } from "@relay/ScenarioStaffViewScreen_Query.graphql";
import { type ScenarioStaffViewScreen_ScenarioFragment$key } from "@relay/ScenarioStaffViewScreen_ScenarioFragment.graphql";
import { IntervalWeightsButton } from "@screens/staff-view/parts/interval-weights-button/interval-weights-button.component";
import { StaffViewFiltersPart } from "@screens/staff-view/parts/staff-view-filters-part";
import { StaffViewPart } from "@screens/staff-view/parts/staff-view-part";
import { IntervalSizeButton } from "./parts/IntervalSizeButton";
import { StaffViewLoadingSkeleton } from "./parts/StaffViewLoadingSkeleton";
import { StaffViewSortSelect } from "./parts/StaffViewSortSelect";
import { RedirectTo } from "../../navigation/RedirectTo";
import { RosterCard } from "../project-view/parts/roster-part";

const QUERY = graphql`
	query ScenarioStaffViewScreen_Query($id: ID!) {
		node(id: $id) {
			... on Scenario {
				...ScenarioStaffViewScreen_ScenarioFragment
			}
		}
		...baseScreen_QueryFragment
		...FilterViewSelector_QueryFragment @arguments(filterByViewType: StaffView)
		...staffViewFiltersPart_QueryFragment

		Views {
			ViewOptions(first: 20, filterByViewType: StaffView)
				@connection(key: "FilterViewSelector_ViewOptions") {
				__id
				edges {
					node {
						id
						name
						viewType
						url
						isDefault
					}
				}
			}
		}
	}
`;

const SCENARIO_QUERY = graphql`
	fragment ScenarioStaffViewScreen_ScenarioFragment on Scenario {
		id
		...DashboardHeader_ScenarioFragment
		...staffViewFiltersPart_ScenarioFragment
		...updateAssignmentsFromDynamicsButton_ScenarioFragment
		...syncWithRandPreconDwhButton_ScenarioFragment
		...loadPursuitProjectsFromRandDwhButton_ScenarioFragment
		...CheckScenarioPermissions_ScenarioFragment
	}
`;

export const SCENARIO_STAFF_VIEW_SCREEN_ROUTE = "/scenarios/:scenarioId/staff-view";

export const ScenarioStaffViewScreen = () => {
	const dispatch = useDispatch();
	const cu = useSelector(selectCurrentUser);
	const ref = useRef<OverlayPanel>(null);
	const [isPrintViewVisible, setIsPrintViewVisible] = useState(false);
	const [isPending, startTransition] = useTransition();
	const {
		params: { scenarioId },
	} = useMatch(SCENARIO_STAFF_VIEW_SCREEN_ROUTE)!;
	const query = useLazyLoadQuery<ScenarioStaffViewScreen_Query>(
		QUERY,
		{
			id: scenarioId!,
		},
		{ fetchPolicy: "network-only" },
	);
	const scenario = useFragment<ScenarioStaffViewScreen_ScenarioFragment$key>(
		SCENARIO_QUERY,
		query.node,
	);

	useLayoutEffect(() => {
		if (!scenario?.id) {
			window.location.reload();
			return;
		}

		if (cu?.user?.extension?.preferredViewType) {
			dispatch(
				initializeFromPreferredView({
					scenarioId: scenario?.id,
					preferredViewType: cu.user.extension.preferredViewType,
				}),
			);
		}
	}, [scenario?.id]);

	useEffect(() => {
		if (!scenario?.id) return;
		const viewOptions = query.Views.ViewOptions.edges?.map((e) => e?.node);
		const defaultView = viewOptions?.find((e) => e?.isDefault);
		dispatch(initializeFromDefaultView(defaultView));
	}, [scenario?.id]);

	const togglePrintView = () => {
		startTransition(() => {
			setIsPrintViewVisible(true);
			setTimeout(() => {
				window.print();
				handlePrintOnClick();
			}, 1000);
		});
	};

	const handlePrintOnClick = () => {
		setTimeout(() => {
			setIsPrintViewVisible(false);
		}, 1000);
	};
	const shouldShowWeights = useSelector(selectShowWeights);

	const filters = useSelector(selectStaffViewFilters);
	const intervalType = filters.intervalType || "Weeks";

	return scenario ? (
		<BaseScreen
			queryFragmentRef={query}
			headerComponents={<DashboardHeader scenarioFragmentRef={scenario} />}
		>
			<div className="flex flex-column h-full to-table-print">
				<DndProvider backend={HTML5Backend}>
					<div className="flex align-items-center mb-2 flex-wrap hide-print">
						<StaffViewFiltersPart queryRef={query} scenarioFragmentRef={scenario} />

						<div className={"ml-auto mr-3"}>
							<div className="flex flex-row gap-2">
								<UseTagColorButton />
								{/* <Button */}
								{/* 	content={{ */}
								{/* 		label: "Show weights", */}
								{/* 		iconPosition: "left", */}
								{/* 		icon: shouldShowWeights */}
								{/* 			? "pi pi-circle-fill" */}
								{/* 			: "pi pi-circle", */}
								{/* 	}} */}
								{/* 	tooltip={{ */}
								{/* 		content: `${shouldShowWeights ? "Hide" : "Show"} weights.`, */}
								{/* 	}} */}
								{/* 	onClick={() => { */}
								{/* 		dispatch(setShowWeights(!shouldShowWeights)); */}
								{/* 	}} */}
								{/* /> */}
								<Button
									content={{
										label: "Views",
										icon: "pi pi-search",
										iconPosition: "left",
									}}
									onClick={(e: any) => {
										ref.current?.toggle(e);
									}}
								/>

								<TkButton
									icon={isPending ? "pi pi-spin pi-spinner" : "pi pi-print"}
									label="Print"
									onClick={() => {
										togglePrintView();
									}}
								/>
							</div>
							<GlobalStyles />
							<OverlayPanel ref={ref} showCloseIcon>
								<Panel header={"Save / Load Views"}>
									<p className="m-0">
										<FilterViewSelector
											queryFragmentRef={query}
											viewType={"StaffView"}
										/>
									</p>
								</Panel>
							</OverlayPanel>
						</div>
						<CheckScenarioPermissions
							requiredPermission={"UserInAccountPermission_Scenario_Edit"}
							scenarioFragmentRef={scenario}
						>
							<IntervalWeightsButton scenarioId={scenario.id} />
						</CheckScenarioPermissions>
						<div className={"mr-3"} />
						<StaffViewSortSelect className="mr-3" />
						<IntervalSizeButton className="mr-3" />
						<UpdateAssignmentsFromDynamicsButton scenarioFragmentRef={scenario} />
						<SyncWithRandPreconDwhButton scenarioFragmentRef={scenario} />
						<LoadPursuitProjectsFromRandDwhButton scenarioFragmentRef={scenario} />
					</div>

					<RosterCard className="card-flat overflow-y-hidden h-full">
						<Suspense fallback={<StaffViewLoadingSkeleton />}>
							<StaffViewPart
								isPrintViewVisible={isPrintViewVisible}
								scenarioId={scenario.id}
							/>
						</Suspense>
					</RosterCard>
				</DndProvider>
			</div>
		</BaseScreen>
	) : (
		<RedirectTo to={"/"} />
	);
};
// TODO
const GlobalStyles = createGlobalStyle`
	.p-overlaypanel {
		z-index: 900 !important; /* Your desired zIndex */
	}
`;

const UseTagColorButton = () => {
	const dispatch = useDispatch();
	const shouldShow = useSelector(selectShouldSeeUseTagColorButton);
	const shouldUseTagColor = useSelector(selectShouldUseTagColor);

	if (!shouldShow) return null;
	return (
		<Button
			content={{
				label: "Tag colors",
				iconPosition: "left",
				icon: shouldUseTagColor ? "pi pi-circle-fill" : "pi pi-circle",
			}}
			tooltip={{
				content: `${
					shouldUseTagColor ? "Hide" : "Show"
				} tag color as border for assignments.`,
			}}
			onClick={() => {
				dispatch(setShouldUseTagColor(!shouldUseTagColor));
			}}
		/>
	);
};
