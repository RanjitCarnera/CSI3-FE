import { TkComponentsContext } from "@thekeytechnology/framework-react-components";
import React, { Fragment, Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { useFragment } from "react-relay";
import { Loader } from "@components/ui/Loader";
import { TkButtonLink } from "@components/ui/TkButtonLink";
import { TkDialog } from "@components/ui/TkDialog";
import { HarkinsTheme } from "@corestyle/component-theme/component-theme";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type editPersonSkillAssociationsButton_PersonFragment$key } from "@relay/editPersonSkillAssociationsButton_PersonFragment.graphql";
import { PERSON_FRAGMENT } from "@screens/people/parts/edit-person-skill-associations-button/edit-person-skill-associations-button.graphql";
import { type EditPersonSkillAssociationsButtonProps } from "@screens/people/parts/edit-person-skill-associations-button/edit-person-skill-associations-button.types";
import { EditPersonSkillAssociationsModalContent } from "@screens/people/parts/edit-person-skill-associations-modal-content";
import { textDefault } from "@screens/skill-assessment/parts/mock/color";
import { PageTitleSpan } from "@screens/skill-assessment/parts/mock/typography";

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
	const [visible, setVisible] = useState(false);
	if (!hasReadAccess) return <Fragment />;

	return (
		<TkComponentsContext.Provider value={HarkinsTheme}>
			<TkButtonLink
				label={hasEditAccess ? "Edit" : hasReadAccess ? "View" : "Edit"}
				onClick={() => {
					setVisible(true);
				}}
			/>

			<TkDialog
				onHide={() => {
					setVisible(false);
				}}
				visible={visible}
				dismissableMask={true}
				header={<PageTitleSpan color={textDefault}>{title}</PageTitleSpan>}
			>
				<Suspense fallback={<Loader />}>
					<EditPersonSkillAssociationsModalContent personFragmentRef={person} />
				</Suspense>
			</TkDialog>
		</TkComponentsContext.Provider>
	);
};
