import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useFragment, useLazyLoadQuery } from "react-relay";
import { useMatch } from "react-router-dom";
import { type availabilityForecastScreen_Query } from "@relay/availabilityForecastScreen_Query.graphql";
import { type availabilityForecastScreen_ScenarioFragment$key } from "@relay/availabilityForecastScreen_ScenarioFragment.graphql";
import { AVAILABILITY_FORECAST_SCREEN_ROUTE } from "@screens/availability-forecast/availability-forecast.consts";
import {
	QUERY,
	SCENARIO_QUERY,
} from "@screens/availability-forecast/availability-forecast.graphql";
import { FormWrapper, Wrapper } from "@screens/availability-forecast/availability-forecast.styles";
import { AvailabilityForecastDisplay } from "./parts/AvailabilityForecastDisplay";
import { GenerateAvailabilityForecastForm } from "./parts/GenerateAvailabilityForecastForm";
import { DashboardHeader } from "../../components/relay/DashboardHeader";
import { BaseScreen } from "../../components/ui/base-screen";
import { RedirectTo } from "../../navigation/RedirectTo";

export const AvailabilityForecastScreen = () => {
	const {
		params: { scenarioId },
	} = useMatch(AVAILABILITY_FORECAST_SCREEN_ROUTE)!;

	const query = useLazyLoadQuery<availabilityForecastScreen_Query>(
		QUERY,
		{
			id: scenarioId!,
		},
		{ fetchPolicy: "network-only" },
	);
	const scenario = useFragment<availabilityForecastScreen_ScenarioFragment$key>(
		SCENARIO_QUERY,
		query.node,
	);

	return scenario ? (
		<BaseScreen
			queryFragmentRef={query}
			headerComponents={<DashboardHeader scenarioFragmentRef={scenario} />}
		>
			<Wrapper>
				<DndProvider backend={HTML5Backend}>
					<FormWrapper>
						<GenerateAvailabilityForecastForm scenarioId={scenario.id} />
					</FormWrapper>

					<div className="flex-grow-1  overflow-y-auto h-full">
						<AvailabilityForecastDisplay />
					</div>
				</DndProvider>
			</Wrapper>
		</BaseScreen>
	) : (
		<RedirectTo to={"/"} />
	);
};
