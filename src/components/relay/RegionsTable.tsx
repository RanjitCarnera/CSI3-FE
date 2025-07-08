import graphql from "babel-plugin-relay/macro";
import debounce from "lodash.debounce";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useLazyLoadQuery, useMutation, usePaginationFragment } from "react-relay";
import { toast } from "react-toastify";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type RegionsTable_RegionInlineFragment$key } from "@relay/RegionsTable_RegionInlineFragment.graphql";
import { CreateRegionButton } from "./CreateRegionButton";
import { DeleteRegionsButton } from "./DeleteRegionsButton";
import { EditRegionButton } from "./EditRegionButton";
import { ExportRegionsButton } from "./ExportRegionsButton";
import { ImportRegionsButton } from "./ImportRegionsButton";
import { type RegionsTable_Query } from "../../__generated__/RegionsTable_Query.graphql";
import { type RegionsTable_Refetch } from "../../__generated__/RegionsTable_Refetch.graphql";
import { type RegionsTable_RegionListFragment$key } from "../../__generated__/RegionsTable_RegionListFragment.graphql";
import { type RegionFilters, selectRegionFilters } from "../../redux/RegionSlice";
import { TkDataTable } from "../ui/TkDataTable";

const QUERY = graphql`
	query RegionsTable_Query($first: Int, $filterByName: String) {
		...RegionsTable_RegionListFragment @arguments(first: $first, filterByName: $filterByName)
	}
`;

const QUERY_FRAGMENT = graphql`
	fragment RegionsTable_RegionListFragment on Query
	@refetchable(queryName: "RegionsTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 20 }
		after: { type: "String" }
		filterByName: { type: "String" }
	) {
		Region {
			Regions(first: $first, after: $after, filterByName: $filterByName)
				@connection(key: "RegionsTable_Regions") {
				__id
				pageInfo {
					endCursor
					hasPreviousPage
					hasNextPage
					startCursor
				}
				edges {
					node {
						...RegionsTable_RegionInlineFragment
					}
				}
			}
		}
	}
`;

const REGION_INLINE_FRAGMENT = graphql`
	fragment RegionsTable_RegionInlineFragment on Region @inline {
		id
		name
		sortOrder
		...EditRegionButton_RegionFragment
	}
`;

export const SET_TAGS_SORT_ORDER_MUTATION = graphql`
	mutation RegionsTable_SetTagsSortOrderMutation($input: SetRegionSortOrderInput!) {
		Region {
			setRegionSortOrder(input: $input) {
				changedRegions {
					...RegionsTable_RegionInlineFragment
				}
			}
		}
	}
`;

export const RegionsTable = () => {
	const filters = useSelector(selectRegionFilters);

	const [initialLoad, setInitialLoadComplete] = useState(true);
	const data = useLazyLoadQuery<RegionsTable_Query>(QUERY, { first: 20, ...filters });

	const [commitSetSortOrder, isInFlight] = useMutation(SET_TAGS_SORT_ORDER_MUTATION);

	const {
		data: {
			Region: {
				Regions: { __id, edges },
			},
		},
		hasNext,
		refetch,
		loadNext,
	} = usePaginationFragment<RegionsTable_Refetch, RegionsTable_RegionListFragment$key>(
		QUERY_FRAGMENT,
		data,
	);
	const regions = useMemo(
		() =>
			edges
				?.map((b) =>
					readInlineData<RegionsTable_RegionInlineFragment$key>(
						REGION_INLINE_FRAGMENT,
						b!.node!,
					),
				)
				.sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1)) ?? [],
		[edges],
	);

	const hasPermissions = useSelector(selectHasPermissions);
	const hasReorderPermission = hasPermissions(["UserInAccountPermission_Region_Edit"]);

	const debouncedRefetch = (filters: RegionFilters) => {
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
				<ImportRegionsButton />
				<ExportRegionsButton />
				<CreateRegionButton connectionId={__id} />
				<DeleteRegionsButton
					regionIds={selection.map((s) => s.id)}
					connectionIds={[__id]}
				/>
			</div>
			<TkDataTable
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are not regions yet.</div>
					</div>
				}
				className="mb-3"
				value={regions}
				selectionMode="multiple"
				onSelectionChange={(e) => {
					// @ts-expect-error
					setSelection(e.value);
				}}
				selection={selection}
				reorderableRows={!isInFlight || hasReorderPermission}
				onRowReorder={(e) => {
					const sourceIndex = e.dragIndex;
					const targetIndex = e.dropIndex;
					const sourceId = regions![sourceIndex].id;
					const targetId = regions![targetIndex].id;

					commitSetSortOrder({
						variables: {
							input: {
								sourceId,
								targetId,
							},
						},
						onCompleted: () => {
							setSelection([]);
							toast.success("Sort Orders Updated.");
						},
					});
				}}
			>
				<Column
					reorderable={hasReorderPermission}
					rowReorder={hasReorderPermission}
					rowReorderIcon={"pi pi-bars"}
				/>
				<Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
				<Column
					header="Name"
					sortable
					sortField={"name"}
					body={(row) => {
						return row.name;
					}}
				/>
				<Column header="Sort order" sortable sortField={"sortOrder"} field={"sortOrder"} />
				<Column
					header="Actions"
					body={(row) => {
						return (
							<div>
								<EditRegionButton className="mr-2" regionFragmentRef={row} />
							</div>
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
