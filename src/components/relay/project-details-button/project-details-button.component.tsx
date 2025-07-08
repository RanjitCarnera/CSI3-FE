import React, { Fragment, Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { useFragment } from "react-relay";
import styled from "styled-components";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { FRAGMENT } from "./project-details-button.graphql";
import { type ProjectDetailsButtonProps } from "./project-details-button.interface";
import { type projectDetailsButton_ProjectInScenario$key } from "../../../__generated__/projectDetailsButton_ProjectInScenario.graphql";
import { Loader } from "../../ui/Loader";
import { TkButtonLink } from "../../ui/TkButtonLink";
import { TkDialog } from "../../ui/TkDialog";
import { ProjectDetailsModalContent } from "../ProjectDetailsModalContent";

export const ProjectDetailsButton = ({
	scenarioId,
	projectFragmentRef,
	className,
}: ProjectDetailsButtonProps) => {
	const project = useFragment<projectDetailsButton_ProjectInScenario$key>(
		FRAGMENT,
		projectFragmentRef,
	);
	const [isVisible, setVisible] = useState<boolean>();
	const hasPermissions = useSelector(selectHasPermissions);
	const hasReadAccess = hasPermissions(["UserInAccountPermission_Skills_Read"]);
	if (!hasReadAccess) return <Fragment />;

	return (
		<>
			<TkButtonLink
				className={className}
				icon="pi pi-search-plus"
				onClick={() => {
					setVisible(true);
				}}
			/>
			<ProjectDetailsModal
				showHeader={false}
				dismissableMask={true}
				visible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				footer={
					<div className="flex justify-content-center">
						<TkButtonLink
							type="button"
							onClick={() => {
								setVisible(false);
							}}
							label={"Cancel"}
							className="m-auto w-auto"
						/>
					</div>
				}
			>
				<Suspense fallback={<Loader />}>
					<ProjectDetailsModalContent
						projectId={project.project.id}
						scenarioId={scenarioId}
					/>
				</Suspense>
			</ProjectDetailsModal>
		</>
	);
};

const ProjectDetailsModal = styled(TkDialog)`
	min-width: 740px;
`;
