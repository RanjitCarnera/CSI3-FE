import { DeleteButton } from "@thekeytechnology/framework-react-components";
import { useMutation } from "react-relay";
import { DELETE_ASSESSMENT_TEMPLATES_MUTATION } from "@screens/skill-assessment-templates/parts/delete-assessment-templates-button/delete-assessment-templates-button.graphql";
import { deleteAssessmentTemplatesButton_DeleteAssessmentTemplateMutation } from "@relay/deleteAssessmentTemplatesButton_DeleteAssessmentTemplateMutation.graphql";

export const DeleteAssessmentTemplatesButton = ({
	assessmentTemplateIds,
	connectionIds,
}: {
	assessmentTemplateIds: string[];
	connectionIds: string[];
}) => {
	const [doDelete, isDeleting] =
		useMutation<deleteAssessmentTemplatesButton_DeleteAssessmentTemplateMutation>(
			DELETE_ASSESSMENT_TEMPLATES_MUTATION,
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
			selectedIds={assessmentTemplateIds}
			singularName={"Assessment Template"}
			pluralName={"Assessments Templates"}
			doDelete={handleDelete}
			buttonVariant={"solid"}
		/>
	);
};
