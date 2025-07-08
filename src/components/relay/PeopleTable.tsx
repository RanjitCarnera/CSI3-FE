import graphql from "babel-plugin-relay/macro";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import styled from "styled-components";
import { PersonDocumentsControlButton } from "@components/person-documents-control-button";
import { EditPersonSkillAssociationsButton } from "@screens/people/parts/edit-person-skill-associations-button";
import { withoutEventPropagation } from "@utils/table.utils";
import { ChangePersonActivationButton } from "./ChangePersonActivationButton";
import { CreatePersonButton } from "./CreatePersonButton";
import { DeletePeopleButton } from "./DeletePeopleButton";
import { EditPersonButton } from "./EditPersonButton";
import { ExportPeopleButton } from "./ExportPeopleButton";
import { GoogleMapsClickout } from "./GoogleMapsClickout";
import { ImportPeoplesoftButton } from "./import-peoplesoft-button";
import { ImportPeopleButton } from "./ImportPeopleButton";
import { type PeopleTable_PeopleListFragment$key } from "../../__generated__/PeopleTable_PeopleListFragment.graphql";
import {
	type PeopleTable_PersonFragment$data,
	type PeopleTable_PersonFragment$key,
} from "../../__generated__/PeopleTable_PersonFragment.graphql";
import { type PeopleTable_Query } from "../../__generated__/PeopleTable_Query.graphql";
import { type PeopleTable_Refetch } from "../../__generated__/PeopleTable_Refetch.graphql";
import { type PeopleFilters, selectPeopleFilters } from "../../redux/PeopleSlice";
import { CommentIcon } from "../ui/CommentIcon";
import { DateDisplay } from "../ui/DateTimeDisplay";
import { TkDataTable } from "../ui/TkDataTable";

const QUERY = graphql`
	query PeopleTable_Query($first: Int, $filterByName: String) {
		...PeopleTable_PeopleListFragment @arguments(first: $first, filterByName: $filterByName)
	}
`;

const FRAGMENT = graphql`
	fragment PeopleTable_PeopleListFragment on Query
	@refetchable(queryName: "PeopleTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 250 }
		after: { type: "String" }
		filterByName: { type: "String" }
	) {
		Staff {
			People(
				first: $first
				after: $after
				filterByName: $filterByName
				showDeactivated: true
			) @connection(key: "PeopleTable_People") {
				__id
				pageInfo {
					endCursor
					hasPreviousPage
					hasNextPage
					startCursor
				}
				edges {
					node {
						id
						...PeopleTable_PersonFragment
					}
				}
			}
		}
	}
`;

const PERSON_FRAGMENT = graphql`
	fragment PeopleTable_PersonFragment on Person @inline {
		id
		isDeactivated
		name
		address {
			longitude
			latitude
			...GoogleMapsClickout_AddressFragment
		}
		startDate
		assignmentRole {
			name
		}
		associatedWithDivisions {
			id
			name
		}
		associatedWithRegions {
			id
			name
		}
		skills(first: 100) {
			edges {
				node {
					id
					data {
						value {
							... on NumericalAssessmentValue {
								kind
								number
							}
							... on BinaryAssessmentValue {
								hasSkill
								kind
							}
						}
					}
				}
			}
		}
		avatar {
			url
		}
		documents {
			id
		}
		comment
		...EditPersonButton_PersonFragment
		...editPersonSkillAssociationsButton_PersonFragment
		...ChangePersonActivationButton_PersonFragment
		...personDocumentsControlButton_PersonFragment
	}
`;

export const PeopleTable = memo(() => {
	const filters = useSelector(selectPeopleFilters);

	const [initialLoad, setInitialLoadComplete] = useState(true);
	const data = useLazyLoadQuery<PeopleTable_Query>(QUERY, { first: 250, ...filters });

	const {
		data: {
			Staff: {
				People: { __id, edges: people },
			},
		},
		hasNext,
		refetch,
		loadNext,
	} = usePaginationFragment<PeopleTable_Refetch, PeopleTable_PeopleListFragment$key>(
		FRAGMENT,
		data,
	);

	const debouncedRefetch = useCallback(
		(filters: PeopleFilters) => {
			refetch({ ...filters, first: 250 }, { fetchPolicy: "network-only" });
		},
		[refetch],
	);

	useEffect(() => {
		if (initialLoad) {
			setInitialLoadComplete(false);
		} else {
			debouncedRefetch(filters);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters]);

	const [selection, setSelection] = useState<Array<{ id: string }>>([]);

	return (
		<>
			<div className="flex justify-content-end gap-2">
				<ImportPeopleButton />
				<ImportPeoplesoftButton peopleIds={selection.map((s) => s.id)} />
				<ExportPeopleButton />
				<CreatePersonButton connectionId={__id} />
				<DeletePeopleButton peopleIds={selection.map((s) => s.id)} connectionIds={[__id]} />
			</div>
			<TkDataTable
				selectionMode="multiple"
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are not people yet.</div>
					</div>
				}
				className="mb-3"
				value={
					people?.map((b) =>
						readInlineData<PeopleTable_PersonFragment$key>(PERSON_FRAGMENT, b!.node!),
					) as PeopleTable_PersonFragment$data[]
				}
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
					body={(row: PeopleTable_PersonFragment$data) => {
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
					body={(row: PeopleTable_PersonFragment$data) => {
						return row.assignmentRole?.name;
					}}
				/>
				<Column
					header="Divisions"
					sortable
					sortField={"associatedWithDivisions.0.name"}
					body={(row: PeopleTable_PersonFragment$data) => {
						return row.associatedWithDivisions
							? row.associatedWithDivisions.map((d: any) => d.name).join(", ")
							: "Not associated";
					}}
				/>
				<Column
					header="Regions"
					sortable
					sortField={"associatedWithRegions.0.name"}
					body={(row: PeopleTable_PersonFragment$data) => {
						return row.associatedWithRegions
							? row.associatedWithRegions.map((d: any) => d.name).join(", ")
							: "Not associated";
					}}
				/>

				<Column
					header="Attributes"
					body={(row: PeopleTable_PersonFragment$data) => {
						const skillCount =
							row.skills?.edges?.filter((e) => e?.node?.data.value.kind !== undefined)
								.length || 0;
						return (
							<div className="flex align-items-center">
								<div className="mr-2">
									{skillCount} skill{skillCount === 1 ? "" : "s"}
								</div>
								{withoutEventPropagation(
									<EditPersonSkillAssociationsButton personFragmentRef={row} />,
								)}
							</div>
						);
					}}
				/>
				<Column
					header="Start Date"
					sortable
					sortField={"startDate"}
					body={(row: PeopleTable_PersonFragment$data) => {
						return <DateDisplay value={row.startDate} />;
					}}
				/>
				<Column
					header="Actions"
					body={(row: PeopleTable_PersonFragment$data) => {
						const component = (
							<div>
								<ChangePersonActivationButton
									className="mr-2"
									personFragmentRef={row}
								/>
								<EditPersonButton className="mr-2" personFragmentRef={row} />
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
						onClick={() => loadNext(100)}
					>
						Load more
					</Button>
				</div>
			)}
		</>
	);
});

const PersonImage = styled.img`
	height: 40px;
	width: 40px;
	object-fit: cover;
`;
