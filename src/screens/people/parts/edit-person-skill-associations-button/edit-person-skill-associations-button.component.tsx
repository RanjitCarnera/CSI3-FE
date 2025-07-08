import { DialogButton, TkComponentsContext } from "@thekeytechnology/framework-react-components";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { useFragment } from "react-relay";
import { HarkinsTheme } from "@corestyle/component-theme/component-theme";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type editPersonSkillAssociationsButton_PersonFragment$key } from "@relay/editPersonSkillAssociationsButton_PersonFragment.graphql";
import { PERSON_FRAGMENT } from "@screens/people/parts/edit-person-skill-associations-button/edit-person-skill-associations-button.graphql";
import { type EditPersonSkillAssociationsButtonProps } from "@screens/people/parts/edit-person-skill-associations-button/edit-person-skill-associations-button.types";
import { EditPersonSkillAssociationsModalContent } from "@screens/people/parts/edit-person-skill-associations-modal-content";

export const EditPersonSkillAssociationsButton = ({
	personFragmentRef,
}: EditPersonSkillAssociationsButtonProps) => {
	const person = useFragment<editPersonSkillAssociationsButton_PersonFragment$key>(
		PERSON_FRAGMENT,
		personFragmentRef,
	);
	const title = `${person.name}'s attributes`;
	const hasPermissions = useSelector(selectHasPermissions);
	const hasReadAccess = hasPermissions(["UserInAccountPermission_Skills_Read"]);
	const hasEditAccess = hasPermissions(["UserInAccountPermission_Skills_Edit"]);
	if (!hasReadAccess) return <Fragment />;
	return (
		<TkComponentsContext.Provider value={HarkinsTheme}>
			<DialogButton
				title={title}
				buttonContent={{ label: hasEditAccess ? "Edit" : hasReadAccess ? "View" : "Edit" }}
				buttonVariant={"subtle"}
				children={() => (
					<EditPersonSkillAssociationsModalContent personFragmentRef={person} />
				)}
			/>
		</TkComponentsContext.Provider>
	);
};
