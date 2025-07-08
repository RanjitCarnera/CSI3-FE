import { graphql } from "babel-plugin-relay/macro";
import { useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import { type ChangeProjectActivationButton_Mutation } from "../../__generated__/ChangeProjectActivationButton_Mutation.graphql";
import { type ChangeProjectActivationButton_ProjectFragment$key } from "../../__generated__/ChangeProjectActivationButton_ProjectFragment.graphql";
import { selectHasPermissions } from "../../redux/CurrentUserSlice";
import { TkButtonLink } from "../ui/TkButtonLink";
import { useDialogLogic } from "../ui/useDialogLogic";

const REMOVE_MUTATION = graphql`
	mutation ChangeProjectActivationButton_Mutation($input: SetProjectActivationInput!) {
		Project {
			setProjectActivation(input: $input) {
				edge {
					node {
						id
						isDeactivated
					}
				}
			}
		}
	}
`;

const ASSIGNMENT_FRAGMENT = graphql`
	fragment ChangeProjectActivationButton_ProjectFragment on Project {
		id
		isDeactivated
	}
`;

interface OwmProps {
	className?: string;
	projectFragmentRef: ChangeProjectActivationButton_ProjectFragment$key;
}

export const ChangeProjectActivationButton = ({ className, projectFragmentRef }: OwmProps) => {
	const person = useFragment<ChangeProjectActivationButton_ProjectFragment$key>(
		ASSIGNMENT_FRAGMENT,
		projectFragmentRef,
	);
	const [setActivation, isSettingActivation] =
		useMutation<ChangeProjectActivationButton_Mutation>(REMOVE_MUTATION);
	const hasPermissions = useSelector(selectHasPermissions);
	const hasPermission = hasPermissions(["UserInAccountPermission_Project_Edit"]);

	const { dialogComponent, showDialog } = useDialogLogic();

	return hasPermission ? (
		<>
			<TkButtonLink
				className={className}
				icon={person.isDeactivated ? "pi pi-check-circle" : "pi pi-times-circle"}
				iconPos="left"
				label={person.isDeactivated ? "Activate" : "Deactivate"}
				disabled={isSettingActivation}
				onClick={() => {
					if (person.isDeactivated) {
						showDialog({
							title: `Reactivate project?`,
							content:
								"Do you really want to reactivate this project? They will then be able to be added to scenarios again.",
							affirmativeText: "Reactivate",
							negativeText: "Cancel",
							dialogCallback: (result) => {
								if (result === "Accept") {
									setActivation({
										variables: {
											input: {
												id: person.id,
												isDeactivated: false,
											},
										},
										onCompleted: () => {
											window.location.reload();
										},
									});
								}
							},
						});
					} else {
						showDialog({
							title: `Deactivate project?`,
							content:
								"Do you really want to deactivate this project? They will not longer be addable to scenarios. They are not removed from projects that already reference them.",
							affirmativeText: "Deactivate",
							negativeText: "Cancel",
							dialogCallback: (result) => {
								if (result === "Accept") {
									setActivation({
										variables: {
											input: {
												id: person.id,
												isDeactivated: true,
											},
										},
										onCompleted: () => {
											window.location.reload();
										},
									});
								}
							},
						});
					}
				}}
			/>
			{dialogComponent}
		</>
	) : null;
};
