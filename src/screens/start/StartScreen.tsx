import { graphql } from "babel-plugin-relay/macro";
import { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLazyLoadQuery } from "react-relay";
import { Navigate, useNavigate } from "react-router-dom";
import { match } from "ts-pattern";
import { selectCurrentUser } from "@redux/CurrentUserSlice";
import { type StartScreen_Query } from "../../__generated__/StartScreen_Query.graphql";
import { AccountSwitcher } from "../../components/ui/AccountSwitcher";
import { BaseScreen } from "../../components/ui/base-screen";
import { LOCAL_STORAGE_KEY_CURRENT_SCENARIO } from "../../components/ui/ChangeCurrentScenarioButton";
import { CreateScenarioButton } from "../../components/ui/CreateScenarioButton";

const QUERY = graphql`
	query StartScreen_Query {
		Scenario {
			Scenarios(first: 1, onlyMaster: true) {
				edges {
					node {
						id
					}
				}
			}
		}
		...baseScreen_QueryFragment
	}
`;

export const StartScreen = () => {
	const query = useLazyLoadQuery<StartScreen_Query>(QUERY, {});
	const navigate = useNavigate();

	const currentScenario = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_SCENARIO);
	const firstScenarioId =
		currentScenario || query.Scenario.Scenarios?.edges?.find(() => true)?.node.id;
	useEffect(() => {
		console.log("firstScenarioId", firstScenarioId);
	}, [query.Scenario.Scenarios]);

	const cu = useSelector(selectCurrentUser);
	const path = match(cu?.user?.extension?.preferredViewType)
		.with("ProjectView", () => "project-view")
		.with("StaffView", () => "staff-view")
		.otherwise(() => "project-view");
	return (
		<Suspense fallback={"Loading..."}>
			{firstScenarioId ? (
				<Navigate to={`/scenarios/${firstScenarioId}/${path}`} />
			) : (
				<BaseScreen
					queryFragmentRef={query}
					headerComponents={
						<>
							<AccountSwitcher className="ml-auto" />
						</>
					}
				>
					<div className="flex align-items-center justify-content-center">
						<CreateScenarioButton
							label={"Create your first Scenario"}
							onCompleted={(id) => {
								navigate(`/scenarios/${id}/project-view`);
							}}
						/>
					</div>
				</BaseScreen>
			)}
		</Suspense>
	);
};
