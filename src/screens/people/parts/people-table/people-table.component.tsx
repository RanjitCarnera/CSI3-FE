import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import styled from "styled-components";
import { PersonDocumentsControlButton } from "@components/person-documents-control-button";
import { ChangePersonActivationButton } from "@components/relay/ChangePersonActivationButton";
import { EditPersonButton } from "@components/relay/EditPersonButton";
import { GoogleMapsClickout } from "@components/relay/GoogleMapsClickout";
import { CommentIcon } from "@components/ui/CommentIcon";
import { DateDisplay } from "@components/ui/DateTimeDisplay";
import { TkDataTable } from "@components/ui/TkDataTable";
import { type activatedPeopleTable_PersonInlineFragment$data } from "@relay/activatedPeopleTable_PersonInlineFragment.graphql";
import { EditPersonSkillAssociationsButton } from "@screens/people/parts/edit-person-skill-associations-button";
import { type PeopleTableProps } from "@screens/people/parts/people-table/people-table.props";
import { withoutEventPropagation } from "@utils/table.utils";

export const PeopleTable = ({
	peopleData,
	selection,
	setSelection,
	hasNext,
	loadNext,
	autoFocusPersonRef,
}: PeopleTableProps) => {
	return (
		<>
			<>
				<TkDataTable
					selectionMode="multiple"
					emptyMessage={
						<div className="flex justify-content-center align-items-center">
							<div className="mr-2">There are no resources yet.</div>
						</div>
					}
					className="mb-3"
					value={peopleData}
					onSelectionChange={(e) => {
						// @ts-expect-error
						setSelection(e.value);
					}}
					selection={selection}
				>
					<Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
					<Column
						header="Name"
						sortable
						sortField={"name"}
						body={(row: activatedPeopleTable_PersonInlineFragment$data) => {
							const addressIncomplete =
								row.address &&
								(row.address?.latitude === undefined || row.address.latitude === 0);
							return (
								<div className="flex align-items-center">
									{row.avatar?.url && (
										<PersonImage
											className="mr-2 border-round-3xl"
											src={row.avatar?.url}
										/>
									)}

									{row.name}

									<GoogleMapsClickout
										className="mr-2"
										addressFragmentRef={row.address}
									/>

									{addressIncomplete && (
										<div className="ml-2 warning flex align-items-center">
											<i className="pi pi-exclamation-triangle mr-2 "></i>
											<div>Incomplete address</div>
										</div>
									)}
									{row.isDeactivated && (
										<Tag value={"Deactivated"} className="ml-2" />
									)}
									{row.comment && (
										<CommentIcon className="ml-2" comment={row.comment} />
									)}
								</div>
							);
						}}
					/>
					<Column
						header="Job Title"
						sortable
						sortField={"assignmentRole.name"}
						body={(row: activatedPeopleTable_PersonInlineFragment$data) => {
							return row.assignmentRole?.name;
						}}
					/>
					<Column
						header="Divisions"
						sortable
						sortField={"associatedWithDivisions.0.name"}
						body={(row: activatedPeopleTable_PersonInlineFragment$data) => {
							return row.associatedWithDivisions
								? row.associatedWithDivisions.map((d: any) => d.name).join(", ")
								: "Not associated";
						}}
					/>
					<Column
						header="Regions"
						sortable
						sortField={"associatedWithRegions.0.name"}
						body={(row: activatedPeopleTable_PersonInlineFragment$data) => {
							return row.associatedWithRegions
								? row.associatedWithRegions.map((d: any) => d.name).join(", ")
								: "Not associated";
						}}
					/>

					<Column
						header="Attributes"
						body={(row: activatedPeopleTable_PersonInlineFragment$data) => {
							const skillCount =
								row.skills?.edges?.filter(
									(e) => e?.node?.data.value.kind !== undefined,
								).length ?? 0;
							return (
								<div className="flex align-items-center">
									<div className="mr-2">
										{skillCount} skill{skillCount === 1 ? "" : "s"}
									</div>
									{withoutEventPropagation(
										<EditPersonSkillAssociationsButton
											personFragmentRef={row}
										/>,
									)}
								</div>
							);
						}}
					/>
					<Column
						header="Start Date"
						sortable
						sortField={"startDate"}
						body={(row: activatedPeopleTable_PersonInlineFragment$data) => {
							return <DateDisplay value={row.startDate} />;
						}}
					/>
					<Column
						header="Actions"
						body={(row: activatedPeopleTable_PersonInlineFragment$data) => {
							const component = (
								<div>
									<ChangePersonActivationButton
										className="mr-2"
										personFragmentRef={row}
									/>
									<EditPersonButton
										className="mr-2"
										personFragmentRef={row}
										autoFocus={row.id === autoFocusPersonRef}
									/>
									{withoutEventPropagation(
										<PersonDocumentsControlButton personFragmentRef={row} />,
									)}
								</div>
							);

							return withoutEventPropagation(component);
						}}
					/>
				</TkDataTable>

				{hasNext && (
					<div className="flex justify-content-center align-items-center">
						<Button
							type="button"
							className="p-button-secondary"
							disabled={!hasNext}
							onClick={() => {
								loadNext(100);
							}}
						>
							Load more
						</Button>
					</div>
				)}
			</>
		</>
	);
};

const PersonImage = styled.img`
	height: 40px;
	width: 40px;
	object-fit: cover;
`;
