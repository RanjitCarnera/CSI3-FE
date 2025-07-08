import { Button as TkButton } from "@thekeytechnology/framework-react-components";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Image } from "primereact/image";
import { TabPanel } from "primereact/tabview";
import React from "react";
import { useSelector } from "react-redux";
import { useFragment, usePaginationFragment } from "react-relay";
import PersonImageSrc from "@assets/person.png";
import { Conditional } from "@components/conditional";
import { SkillsDisplay } from "@components/person-details-button/parts/person-details-control/parts/skills-display";
import {
	PERSON_FRAGMENT,
	QUERY_FRAGMENT,
} from "@components/person-details-button/parts/person-details-control/person-details-control.graphql";
import { PersonImage } from "@components/person-details-button/parts/person-details-control/person-details-control.styles";
import { type PersonDetailsControlProps } from "@components/person-details-button/parts/person-details-control/person-details-control.types";
import { AssignmentProjectCard } from "@components/relay/AssignmentProjectCard";
import { UtilizationOverTimeGraph } from "@components/relay/UtilizationOverTimeGraph";
import { AddressDisplay } from "@components/ui/AddressDisplay";
import { TkTabView } from "@components/ui/TkTabView";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type personDetailsControl_AssignmentListFragment$key } from "@relay/personDetailsControl_AssignmentListFragment.graphql";
import { type personDetailsControl_PersonFragment$key } from "@relay/personDetailsControl_PersonFragment.graphql";
import { type PersonDetailsControl_Refetch } from "@relay/PersonDetailsControl_Refetch.graphql";
import { type personDocumentsControlButton_DocumentInlineFragment$data } from "@relay/personDocumentsControlButton_DocumentInlineFragment.graphql";

export const PersonDetailsControl = ({
	personFragmentRef,
	assignmentsFragmentRef,
}: PersonDetailsControlProps) => {
	const person = useFragment<personDetailsControl_PersonFragment$key>(
		PERSON_FRAGMENT,
		personFragmentRef,
	);
	const {
		data: {
			Assignments: {
				Assignments: { edges: assignmentEdges },
			},
		},
		hasNext,
		loadNext,
	} = usePaginationFragment<
		PersonDetailsControl_Refetch,
		personDetailsControl_AssignmentListFragment$key
	>(QUERY_FRAGMENT, assignmentsFragmentRef);

	const assignments = assignmentEdges?.map((e) => e!.node!) || [];

	const presentAssignments = assignments?.filter((a) => a!.time === "Present") || [];
	const pastAssignments = assignments?.filter((a) => a!.time === "Past") || [];
	const futureAssignments = assignments?.filter((a) => a!.time === "Future") || [];
	const hasPermissions = useSelector(selectHasPermissions);

	const hasPrivateDataReadPermission = hasPermissions([
		"UserInAccountPermission_PrivateData_Read",
	]);
	const hasDocumentReadPermission = hasPermissions([
		"UserInAccountPermission_PersonDocument_Read",
	]);
	const hasDocumentWritePermission = hasPermissions([
		"UserInAccountPermission_PersonDocument_Write",
	]);

	const hasSkillTabPermission = hasPermissions(["UserInAccountPermission_Skills_Read"]);
	const hasUtilizationTabPermission = hasPermissions([
		"UserInAccountPermission_Utilization_Read",
	]);
	return (
		<div>
			<div className="mb-4 flex">
				<div className="mr-3">
					<PersonImage src={person.avatar?.url || PersonImageSrc} />
				</div>
				<div className="flex-grow-1">
					{person.employeeId && (
						<div className="small-text text-light mb-2">
							<i className="pi pi-id-card mr-2" /> {person.employeeId}
						</div>
					)}
					{hasPrivateDataReadPermission && person.phone && (
						<div className="small-text text-light mb-2">
							<i className="pi pi-phone mr-2" /> {person.phone}
						</div>
					)}
					{person.email && (
						<div className="small-text text-light mb-2">
							<i className="pi pi-envelope mr-2" /> {person.email}
						</div>
					)}
					{hasPrivateDataReadPermission && person.address && (
						<div className="small-text text-light mb-2">
							<i className="pi pi-building mr-2" />{" "}
							<AddressDisplay value={person.address} />
						</div>
					)}
					{(person.associatedWithDivisions?.length || 0) > 0 && (
						<div className="small-text text-light mb-2">
							<i className="pi pi-compass mr-2" />{" "}
							{person.associatedWithDivisions!.map((d) => d.name).join(", ")}
						</div>
					)}
					{(person.associatedWithRegions?.length || 0) > 0 && (
						<div className="small-text text-light mb-2">
							<i className="pi pi-map mr-2" />{" "}
							{person.associatedWithRegions!.map((r) => r.name).join(", ")}
						</div>
					)}
					{(person.superVisorsRef?.length ?? 0) > 0 && (
						<div className="small-text text-light">
							<i className="pi pi-sitemap mr-2" />{" "}
							{person.superVisorsRef!.map((supervisor) => supervisor.name).join(", ")}
						</div>
					)}
					{(person.documents?.length ?? 0) > 0 && (
						<div className="small-text text-light">
							<i className="pi pi-folder-open mr-2" /> {person.documents!.length}{" "}
							document{person.documents.length > 1 ? "s" : ""}
						</div>
					)}
				</div>
			</div>

			<div>
				<TkTabView>
					<TabPanel header="Current assignments">
						<AssignmentComponent assignments={presentAssignments} />
					</TabPanel>
					<TabPanel header="Future assignments">
						<AssignmentComponent assignments={futureAssignments} />
					</TabPanel>
					<TabPanel header="Past assignments">
						<AssignmentComponent assignments={pastAssignments} />
					</TabPanel>
					{hasSkillTabPermission && (
						<TabPanel header="Attributes">
							<SkillsDisplay personFragmentRef={person} />
						</TabPanel>
					)}
					{hasUtilizationTabPermission && (
						<TabPanel header="Utilization">
							<UtilizationOverTimeGraph personFragmentRef={person} />
						</TabPanel>
					)}
					{person.comment && (
						<TabPanel header="Comments">
							<div className="w-12">{person.comment}</div>
						</TabPanel>
					)}
					{(hasDocumentReadPermission || hasDocumentWritePermission) && (
						<TabPanel header="Documents">
							<Conditional.Root condition={person.documents.length > 0}>
								<Conditional.Success>
									<DataTable
										value={[...person.documents]}
										tableStyle={{ minWidth: "50rem" }}
									>
										<Column
											body={(
												row: personDocumentsControlButton_DocumentInlineFragment$data,
											) => {
												if (!row.thumbnail) return null;
												return (
													<Image
														src={row.thumbnail ?? ""}
														zoomSrc={row.url ?? ""}
														alt={row.name}
														width={"80"}
														height={"80"}
														preview
													/>
												);
											}}
											header="Preview"
										></Column>
										<Column
											body={(
												row: personDocumentsControlButton_DocumentInlineFragment$data,
											) => row.name}
											header="Name"
										></Column>
										<Column
											body={(
												row: personDocumentsControlButton_DocumentInlineFragment$data,
											) => {
												return row.fileType;
											}}
											header="File type"
										></Column>
										<Column
											body={(
												row: personDocumentsControlButton_DocumentInlineFragment$data,
											) => {
												return (
													<>
														<TkButton
															inputVariant={"subtle"}
															content={{
																label: "Download",
																icon: "pi pi-download",
																iconPosition: "left",
															}}
															onClick={() => {
																if (!row.url) return;
																window.open(row.url, "_blank");
															}}
														/>
													</>
												);
											}}
											header="Actions"
										></Column>
									</DataTable>
								</Conditional.Success>
								<Conditional.Fallback>No documents</Conditional.Fallback>
							</Conditional.Root>
						</TabPanel>
					)}
				</TkTabView>

				{hasNext && (
					<div className="flex justify-content-center align-items-center">
						<Button
							type="button"
							className="p-button-secondary"
							disabled={!hasNext}
							onClick={() => loadNext(20)}
						>
							Load more
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

interface AssignmentComponentProps {
	assignments: any[];
}

const AssignmentComponent = ({ assignments }: AssignmentComponentProps) => {
	return assignments.length === 0 ? (
		<div>No assignments found.</div>
	) : (
		<div className="grid">
			{assignments.map((assignment) => (
				<AssignmentProjectCard
					key={"user-details-" + assignment!.id}
					className="col-4"
					assignmentFragmentRef={assignment}
				/>
			))}
		</div>
	);
};
