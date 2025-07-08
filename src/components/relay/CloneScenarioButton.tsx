import { graphql } from "babel-plugin-relay/macro";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type CloneScenarioButton_CloneMutation } from "../../__generated__/CloneScenarioButton_CloneMutation.graphql";
import { type CloneScenarioButton_ScenarioFragment$key } from "../../__generated__/CloneScenarioButton_ScenarioFragment.graphql";
import { EditScenarioForm, type EditScenarioFormState } from "../ui/EditScenarioForm";
import { SuspenseDialogWithState } from "../ui/SuspenseDialogWithState";
import { TkButtonLink } from "../ui/TkButtonLink";

const FRAGMENT = graphql`
	fragment CloneScenarioButton_ScenarioFragment on Scenario {
		id
		name
	}
`;

const MUTATION = graphql`
	mutation CloneScenarioButton_CloneMutation($input: CloneScenarioInput!, $connections: [ID!]!) {
		Scenario {
			cloneScenario(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						id
						...UserScenariosTable_ScenarioFragment
						...ScenariosTable_ScenarioFragment
					}
				}
			}
		}
	}
`;

interface OwnProps {
	className?: string;
	connections: string[];
	scenarioFragmentRef: CloneScenarioButton_ScenarioFragment$key;
}

export const CloneScenarioButton = ({ className, connections, scenarioFragmentRef }: OwnProps) => {
	const [clone, isCloning] = useMutation<CloneScenarioButton_CloneMutation>(MUTATION);
	const [isVisible, setVisible] = useState(false);
	const hasPermissions = useSelector(selectHasPermissions);

	const hasPermission = hasPermissions(["UserInAccountPermission_Scenario_Edit"]);

	const scenario = useFragment<CloneScenarioButton_ScenarioFragment$key>(
		FRAGMENT,
		scenarioFragmentRef,
	);
	return hasPermission ? (
		<>
			<TkButtonLink
				className={className}
				icon="pi pi-copy"
				iconPos="left"
				label="Clone"
				disabled={isCloning}
				onClick={() => {
					setVisible(true);
				}}
			/>

			<SuspenseDialogWithState<EditScenarioFormState>
				title={"Clone scenario"}
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				formComponent={(ref, onHide) => {
					return (
						<EditScenarioForm
							initialState={{
								name: `Clone of scenario ${scenario.name}`,
							}}
							ref={ref}
							onSubmit={(values) => {
								clone({
									variables: {
										input: {
											scenarioId: scenario.id,
											newName: values.name!,
										},
										connections,
									},
									onCompleted: () => {
										ref.current?.setSubmitting(false);
										ref.current?.resetForm({});
										onHide();
									},
								});
							}}
						/>
					);
				}}
			/>
		</>
	) : null;
};
