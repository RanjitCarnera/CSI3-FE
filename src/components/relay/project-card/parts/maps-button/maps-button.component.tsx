import { Button } from "@thekeytechnology/framework-react-components";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type MapButtonProps } from "@components/relay/project-card/parts/maps-button/maps-button.types";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { SCENARIO_MAP_VIEW_SCREEN_ROUTE } from "@screens/map-view/ScenarioMapViewScreen";

export const MapsButton = ({ scenarioId, projectInScenarioId }: MapButtonProps) => {
	const hasPermissions = useSelector(selectHasPermissions);
	const hasMapsReadPermissions = hasPermissions(["UserInAccountPermission_Maps_Read"]);
	const navigate = useNavigate();

	return !hasMapsReadPermissions ? (
		<Fragment />
	) : (
		<Button
			inputVariant={"subtle"}
			content={{ icon: "pi pi-map" }}
			onClick={() => {
				navigate(
					SCENARIO_MAP_VIEW_SCREEN_ROUTE.replace(":scenarioId", scenarioId).replace(
						":projectId",
						projectInScenarioId,
					),
				);
			}}
		/>
	);
};
