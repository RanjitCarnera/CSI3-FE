import graphql from "babel-plugin-relay/macro";
import debounce from "lodash.debounce";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { DuplicateStaffingTemplateButton } from "@components/duplicate-staffing-template-button";
import { withoutEventPropagation } from "@utils/table.utils";
import { CreateStaffingTemplateButton } from "./CreateStaffingTemplateButton";
import { DeleteStaffingTemplatesButton } from "./DeleteStaffingTemplatesButton";
import { EditStaffingTemplateButton } from "./EditStaffingTemplateButton";
import { ExportStaffingTemplatesButton } from "./ExportStaffingTemplatesButton";
import { ImportStaffingTemplatesButton } from "./ImportStaffingTemplatesButton";
import { type StaffingTemplatesTable_Query } from "../../__generated__/StaffingTemplatesTable_Query.graphql";
import { type StaffingTemplatesTable_Refetch } from "../../__generated__/StaffingTemplatesTable_Refetch.graphql";
import { type StaffingTemplatesTable_StaffingTemplateListFragment$key } from "../../__generated__/StaffingTemplatesTable_StaffingTemplateListFragment.graphql";
import {
	selectStaffingTemplateFilters,
	type StaffingTemplateFilters,
} from "../../redux/StaffingTemplatesSlice";
import { IsExecutiveIcon } from "../ui/IsExecutiveIcon";
import { TkDataTable } from "../ui/TkDataTable";

const QUERY = graphql`
	query StaffingTemplatesTable_Query($first: Int, $filterByName: String) {
		...StaffingTemplatesTable_StaffingTemplateListFragment
			@arguments(first: $first, filterByName: $filterByName)
	}
`;

const PROJECTS_FRAGMENT = graphql`
	fragment StaffingTemplatesTable_StaffingTemplateListFragment on Query
	@refetchable(queryName: "StaffingTemplatesTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 20 }
		after: { type: "String" }
		filterByName: { type: "String" }
	) {
		Template {
			StaffingTemplates(first: $first, after: $after, filterByName: $filterByName)
				@connection(key: "StaffingTemplatesTable_StaffingTemplates") {
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
						name
						assignmentRoleAssociations {
							assignmentRole {
								id
								name
							}
							isExecutive
						}
						...EditStaffingTemplateButton_StaffingTemplateFragment
						...duplicateStaffingTemplateButton_StaffingTemplateFragment
					}
				}
			}
		}
	}
`;

export const StaffingTemplatesTable = () => {
	const filters = useSelector(selectStaffingTemplateFilters);

	const [initialLoad, setInitialLoadComplete] = useState(true);
	const data = useLazyLoadQuery<StaffingTemplatesTable_Query>(QUERY, { first: 20, ...filters });

	const {
		data: {
			Template: {
				StaffingTemplates: { __id, edges: staffingTemplates },
			},
		},
		hasNext,
		refetch,
		loadNext,
	} = usePaginationFragment<
		StaffingTemplatesTable_Refetch,
		StaffingTemplatesTable_StaffingTemplateListFragment$key
	>(PROJECTS_FRAGMENT, data);

	const debouncedRefetch = (filters: StaffingTemplateFilters) => {
		refetch({ ...filters, first: 20 }, { fetchPolicy: "network-only" });
	};

	const debouncedEventHandler = useMemo(
		() => debounce(debouncedRefetch, 1000),
		// eslint-disable-next-line
		[],
	);

	useEffect(() => {
		if (initialLoad) {
			setInitialLoadComplete(false);
		} else {
			debouncedEventHandler(filters);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters]);
	const [selection, setSelection] = useState<Array<{ id: string }>>([]);
	return (
		<>
			<div className="flex justify-content-end gap-2">
				<ImportStaffingTemplatesButton />
				<ExportStaffingTemplatesButton />
				<CreateStaffingTemplateButton connectionId={__id} />
				<DeleteStaffingTemplatesButton
					staffingTemplateIds={selection.map((s) => s.id)}
					connectionIds={[__id]}
				/>
			</div>
			<TkDataTable
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are not Staffing Templates yet.</div>
					</div>
				}
				className="mb-3"
				value={staffingTemplates?.map((b) => b!.node!) as any[]}
				selectionMode="multiple"
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
					body={(row) => {
						return row.name;
					}}
				/>
				<Column
					header="Roles"
					body={(row) => {
						return (
							<div className="flex align-items-center">
								{row.assignmentRoleAssociations?.map(
									(association: any, index: number) => {
										return (
											<div
												className="mr-2 flex align-items-center"
												key={association.assignmentRole?.id}
											>
												{association.assignmentRole?.name}
												{association.isExecutive && (
													<IsExecutiveIcon className="ml-2" />
												)}
												{index <
													row.assignmentRoleAssociations.length - 1 &&
													", "}
											</div>
										);
									},
								)}
							</div>
						);
					}}
				/>
				<Column
					header="Actions"
					body={(row) => {
						return withoutEventPropagation(
							<div className={"flex justify-content-center align-items-center gap-2"}>
								<DuplicateStaffingTemplateButton
									className={"mr-2"}
									staffingTemplateFragmentRef={row}
									connectionId={__id}
								/>
								<EditStaffingTemplateButton
									className="mr-2"
									staffingTemplateFragmentRef={row}
								/>
							</div>,
						);
					}}
				/>
			</TkDataTable>

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
		</>
	);
};
