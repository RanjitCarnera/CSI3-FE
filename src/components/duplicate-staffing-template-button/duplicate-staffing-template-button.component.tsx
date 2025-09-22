import { useFragment, useMutation } from "react-relay";
import { toast } from "react-toastify";
import {
	DUPLICATE_STAFFING_TEMPLATE,
	STAFFING_TEMPLATE_FRAGMENT,
} from "@components/duplicate-staffing-template-button/duplicate-staffing-template-button.graphql";
import { type duplicateStaffingTemplateButton_DuplicateStaffingTemplateMutation } from "@relay/duplicateStaffingTemplateButton_DuplicateStaffingTemplateMutation.graphql";
import { type duplicateStaffingTemplateButton_StaffingTemplateFragment$key } from "@relay/duplicateStaffingTemplateButton_StaffingTemplateFragment.graphql";
import { type DuplicateStaffingTemplateButtonProps } from "./duplicate-staffing-template-button.types";
import { TkButtonLink } from "../ui/TkButtonLink";

export const DuplicateStaffingTemplateButton = ({
	className,
	staffingTemplateFragmentRef,
	connectionId,
}: DuplicateStaffingTemplateButtonProps) => {
	const staffingTemplate =
		useFragment<duplicateStaffingTemplateButton_StaffingTemplateFragment$key>(
			STAFFING_TEMPLATE_FRAGMENT,
			staffingTemplateFragmentRef,
		);

	const [commit, isInFlight] =
		useMutation<duplicateStaffingTemplateButton_DuplicateStaffingTemplateMutation>(
			DUPLICATE_STAFFING_TEMPLATE,
		);
	return (
		<>
			<TkButtonLink
				className={className}
				icon="pi pi-copy"
				disabled={isInFlight}
				iconPos="left"
				label="Duplicate"
				onClick={() => {
					commit({
						variables: {
							input: {
								id: staffingTemplate.id,
							},
							connections: [connectionId],
						},
						onCompleted: () => {
							toast.success("Duplicated staffing template.");
						},
					});
				}}
			/>
		</>
	);
};
