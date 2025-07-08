import { DeleteButton } from "@thekeytechnology/framework-react-components";
import { useMutation } from "react-relay";
import { DELETE_ASSESSMENTS_MUTATION } from "@screens/skill-assessments/parts/skill-assessments-table/delete-assessments-button/delete-assessments-button.graphql";
import { deleteAssessmentsButton_DeleteAssessmentMutation } from "@relay/deleteAssessmentsButton_DeleteAssessmentMutation.graphql";

export const DeleteAssessmentsButton = ({
	assessmentIds,
	connectionIds,
}: {
	assessmentIds: string[];
	connectionIds: string[];
}) => {
	const [doDelete, isDeleting] = useMutation<deleteAssessmentsButton_DeleteAssessmentMutation>(
		DELETE_ASSESSMENTS_MUTATION,
	);
	const handleDelete = (ids: string[]) => {
		doDelete({
			variables: {
				input: {
					ids: ids,
				},
				connections: connectionIds,
			},
		});
	};

	return (
		<DeleteButton
			isDeleting={isDeleting}
			selectedIds={assessmentIds}
			singularName={"Assessment"}
			pluralName={"Assessments"}
			doDelete={handleDelete}
			buttonVariant={"solid"}
		/>
	);
};
