import { graphql } from "babel-plugin-relay/macro";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { EditScenarioForm, type EditScenarioFormState } from "./EditScenarioForm";
import { SuspenseDialogWithState } from "./SuspenseDialogWithState";
import { TkButton } from "./TkButton";
import { type CreateScenarioButton_CreateMutation } from "../../__generated__/CreateScenarioButton_CreateMutation.graphql";

const CREATE_MUTATION = graphql`
	mutation CreateScenarioButton_CreateMutation($input: CreateScenarioInput!, $connectionId: ID!) {
		Scenario {
			createScenario(input: $input) {
				edge @appendEdge(connections: [$connectionId]) {
					node {
						id
						name
						isMasterPlan
					}
				}
			}
		}
	}
`;

interface OwnProps {
	className?: string;
	label?: string;
	connectionId?: string;
	onCompleted?: (id: string) => void;
}

export const CreateScenarioButton = ({ className, connectionId, label, onCompleted }: OwnProps) => {
	const [isVisible, setVisible] = useState<boolean>(false);
	const [create] = useMutation<CreateScenarioButton_CreateMutation>(CREATE_MUTATION);
	const hasPermissions = useSelector(selectHasPermissions);

	const hasAccess = hasPermissions(["UserInAccountPermission_Scenario_Edit"]);

	return hasAccess ? (
		<div className={className}>
			<TkButton
				onClick={() => {
					setVisible(true);
				}}
				label={label || "Create Scenario"}
			/>

			<SuspenseDialogWithState<EditScenarioFormState>
				title={"Create scenario"}
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				formComponent={(ref, onHide) => {
					return (
						<EditScenarioForm
							initialState={{}}
							ref={ref}
							onSubmit={(values) => {
								create({
									variables: {
										input: {
											name: values.name!,
										},
										connectionId: connectionId || "",
									},
									onCompleted: (e) => {
										ref.current?.setSubmitting(false);
										onCompleted &&
											onCompleted(e.Scenario.createScenario?.edge.node.id!);
										onHide();
									},
									onError: () => {
										ref.current?.setSubmitting(false);
									},
								});
							}}
						/>
					);
				}}
			/>
		</div>
	) : null;
};
