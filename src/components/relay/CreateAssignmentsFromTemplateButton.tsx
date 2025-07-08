import { graphql } from "babel-plugin-relay/macro";
import React, { useState } from "react";
import { useFragment, useMutation } from "react-relay";
import { type CreateAssignmentsFromTemplateButton_CreateMutation } from "../../__generated__/CreateAssignmentsFromTemplateButton_CreateMutation.graphql";
import { type CreateAssignmentsFromTemplateButton_ProjectFragment$key } from "../../__generated__/CreateAssignmentsFromTemplateButton_ProjectFragment.graphql";
import {
	ChooseStaffingTemplateForm,
	type ChooseStaffingTemplateFormState,
} from "../ui/ChooseStaffingTemplateForm";
import { SuspenseDialogWithState } from "../ui/SuspenseDialogWithState";
import { TkButtonLink } from "../ui/TkButtonLink";

const PROJECT_FRAGMENT = graphql`
	fragment CreateAssignmentsFromTemplateButton_ProjectFragment on Project {
		id
		...EditAssignmentForm_ProjectFragment
	}
`;

const CREATE_MUTATION = graphql`
	mutation CreateAssignmentsFromTemplateButton_CreateMutation(
		$input: CreateAssignmentsFromTemplateInput!
	) {
		Scenario {
			createAssignmentsFromTemplate(input: $input) {
				edge {
					node {
						id
						...assignmentsInProject_ProjectFragment
						...projectCard_ProjectFragment
					}
				}
			}
		}
	}
`;

interface OwnProps {
	className?: string;
	scenarioId: string;
	projectFragmentRef: CreateAssignmentsFromTemplateButton_ProjectFragment$key;
}

export const CreateAssignmentsFromTemplateButton = React.memo(
	({ className, scenarioId, projectFragmentRef }: OwnProps) => {
		const [isVisible, setVisible] = useState<boolean>(false);
		const project = useFragment<CreateAssignmentsFromTemplateButton_ProjectFragment$key>(
			PROJECT_FRAGMENT,
			projectFragmentRef,
		);
		const [create] =
			useMutation<CreateAssignmentsFromTemplateButton_CreateMutation>(CREATE_MUTATION);

		return (
			<>
				<TkButtonLink
					className={className}
					onClick={() => {
						setVisible(true);
					}}
				>
					<div className="flex justify-content-center align-items-center">
						+ create assignments from template
					</div>
				</TkButtonLink>

				<SuspenseDialogWithState<ChooseStaffingTemplateFormState>
					title={"Create assignments from template"}
					isVisible={isVisible}
					onHide={() => {
						setVisible(false);
					}}
					affirmativeText={"Create"}
					formComponent={(ref, onHide) => {
						return (
							<ChooseStaffingTemplateForm
								ref={ref}
								initialState={{}}
								onSubmit={(values, { setSubmitting }) => {
									create({
										variables: {
											input: {
												scenarioId,
												projectId: project.id,
												templateId: values.staffingTemplateId!,
											},
										},
										onCompleted: () => {
											setSubmitting(false);
											onHide();
										},
									});
								}}
							/>
						);
					}}
				/>
			</>
		);
	},
);
