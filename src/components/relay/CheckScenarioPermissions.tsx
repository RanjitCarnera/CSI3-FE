import { Permission } from "../../__generated__/PermissionsField_Query.graphql";
import { graphql } from "babel-plugin-relay/macro";
import { useFragment } from "react-relay";
import { ReactNode } from "react";
import { CheckScenarioPermissions_ScenarioFragment$key } from "../../__generated__/CheckScenarioPermissions_ScenarioFragment.graphql";
import { selectPermissionsInAccount } from "../../redux/CurrentUserSlice";
import { useSelector } from "react-redux";

const SCENARIO_FRAGMENT = graphql`
	fragment CheckScenarioPermissions_ScenarioFragment on Scenario {
		isMasterPlan
	}
`;

interface OwnProps {
	scenarioFragmentRef: CheckScenarioPermissions_ScenarioFragment$key;
	requiredPermission: Permission;
	children: ReactNode;
	alternative?: ReactNode;
}

export const CheckScenarioPermissions = ({
	scenarioFragmentRef,
	requiredPermission,
	children,
	alternative,
}: OwnProps) => {
	const permissions = useSelector(selectPermissionsInAccount);
	const scenario = useFragment<CheckScenarioPermissions_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragmentRef,
	);

	const hasRequiredPermission =
		permissions.includes(requiredPermission) ||
		permissions.includes("UserInAccountPermission_System_Owner");
	const isMasterPlanAndUserHasMasterPlanRights =
		scenario.isMasterPlan &&
		(permissions.includes("UserInAccountPermission_Scenario_Masterplan") ||
			permissions.includes("UserInAccountPermission_System_Owner"));
	const isNotMasterPlan = !scenario.isMasterPlan;
	const hasPotentialMasterPlanPermissions =
		isMasterPlanAndUserHasMasterPlanRights || isNotMasterPlan;
	if (hasRequiredPermission && hasPotentialMasterPlanPermissions) return <>{children}</>;
	else return alternative ? <>{alternative}</> : null;
};
