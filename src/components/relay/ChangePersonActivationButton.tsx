import { graphql } from "babel-plugin-relay/macro";
import { useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type ChangePersonActivationButton_Mutation } from "../../__generated__/ChangePersonActivationButton_Mutation.graphql";
import { type ChangePersonActivationButton_PersonFragment$key } from "../../__generated__/ChangePersonActivationButton_PersonFragment.graphql";
import { TkButtonLink } from "../ui/TkButtonLink";
import { useDialogLogic } from "../ui/useDialogLogic";

const REMOVE_MUTATION = graphql`
	mutation ChangePersonActivationButton_Mutation($input: SetPersonActivationInput!) {
		Staff {
			setPersonActivation(input: $input) {
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
	fragment ChangePersonActivationButton_PersonFragment on Person {
		id
		isDeactivated
	}
`;

interface OwmProps {
	className?: string;
	personFragmentRef: ChangePersonActivationButton_PersonFragment$key;
}

export const ChangePersonActivationButton = ({ className, personFragmentRef }: OwmProps) => {
	const person = useFragment<ChangePersonActivationButton_PersonFragment$key>(
		ASSIGNMENT_FRAGMENT,
		personFragmentRef,
	);
	const [setActivation, isSettingActivation] =
		useMutation<ChangePersonActivationButton_Mutation>(REMOVE_MUTATION);
	const hasPermissions = useSelector(selectHasPermissions);
	const hasPermission = hasPermissions(["UserInAccountPermission_Staff_Edit"]);

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
							title: `Reactivate person?`,
							content:
								"Do you really want to reactivate this person? They will again show up in the roster and reports.",
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
									});
								}
							},
						});
					} else {
						showDialog({
							title: `Deactivate person?`,
							content:
								"Do you really want to deactivate this person? They will not show up in the roster and reports.",
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
