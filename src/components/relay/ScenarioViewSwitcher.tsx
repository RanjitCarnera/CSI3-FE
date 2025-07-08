import { useDispatch } from "react-redux";
import { useMatch, useNavigate } from "react-router-dom";
import { AVAILABILITY_FORECAST_SCREEN_ROUTE } from "@screens/availability-forecast";
import { SCENARIO_PROJECT_VIEW_SCREEN_ROUTE } from "@screens/project-view/ScenarioProjectViewScreen";
import { SCENARIO_STAFF_VIEW_SCREEN_ROUTE } from "@screens/staff-view/ScenarioStaffViewScreen";
import { setSelectedProjectId } from "../../redux/ProjectViewSlice";
import { TkButton } from "../ui/TkButton";

interface OwnProps {
	className?: string;
}

export const ScenarioViewSwitcher = ({ className }: OwnProps) => {
	const matchesProjectView = useMatch(SCENARIO_PROJECT_VIEW_SCREEN_ROUTE)!;
	const matchesStaffView = useMatch(SCENARIO_STAFF_VIEW_SCREEN_ROUTE)!;
	const matchesAvailabilityForecast = useMatch(AVAILABILITY_FORECAST_SCREEN_ROUTE)!;
	const dispatch = useDispatch();

	const scenarioId =
		matchesStaffView?.params.scenarioId ||
		matchesProjectView?.params.scenarioId ||
		matchesAvailabilityForecast?.params.scenarioId;

	const navigate = useNavigate();
	return (
		<div className={className}>
			<TkButton
				className="mr-2"
				disabled={!!matchesProjectView}
				onClick={() => {
					navigate(
						SCENARIO_PROJECT_VIEW_SCREEN_ROUTE.replace(":scenarioId", scenarioId || ""),
					);
					dispatch(setSelectedProjectId(undefined));
				}}
				label="Project View"
			/>
			<TkButton
				className="mr-2"
				disabled={!!matchesStaffView}
				onClick={() => {
					navigate(
						SCENARIO_STAFF_VIEW_SCREEN_ROUTE.replace(":scenarioId", scenarioId || ""),
					);
				}}
				label="Resource View"
			/>
			<TkButton
				disabled={!!matchesAvailabilityForecast}
				onClick={() => {
					navigate(
						AVAILABILITY_FORECAST_SCREEN_ROUTE.replace(":scenarioId", scenarioId || ""),
					);
				}}
				label="Forecast"
			/>
		</div>
	);
};
