import { graphql } from "babel-plugin-relay/macro";
import { useState } from "react";
import { useFragment } from "react-relay";
import { EditStaffingTemplateModal } from "./EditStaffingTemplateModal";
import { type EditStaffingTemplateButton_StaffingTemplateFragment$key } from "../../__generated__/EditStaffingTemplateButton_StaffingTemplateFragment.graphql";
import { TkButtonLink } from "../ui/TkButtonLink";

const PROJECT_FRAGMENT = graphql`
	fragment EditStaffingTemplateButton_StaffingTemplateFragment on StaffingTemplate {
		...EditStaffingTemplateModal_StaffingTemplateFragment
	}
`;

interface OwnProps {
	className?: string;
	staffingTemplateFragmentRef: EditStaffingTemplateButton_StaffingTemplateFragment$key;
}

export const EditStaffingTemplateButton = ({
	className,
	staffingTemplateFragmentRef,
}: OwnProps) => {
	const [isVisible, setVisible] = useState(false);
	const StaffingTemplate = useFragment<EditStaffingTemplateButton_StaffingTemplateFragment$key>(
		PROJECT_FRAGMENT,
		staffingTemplateFragmentRef,
	);
	return (
		<>
			<TkButtonLink
				className={className}
				icon="pi pi-pencil"
				iconPos="left"
				label="Edit"
				onClick={() => {
					setVisible(true);
				}}
			/>

			<EditStaffingTemplateModal
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				onCompleted={() => {
					setVisible(false);
				}}
				staffingTemplateFragmentRef={StaffingTemplate}
			/>
		</>
	);
};
