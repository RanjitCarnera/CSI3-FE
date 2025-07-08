import graphql from "babel-plugin-relay/macro";
import debounce from "lodash.debounce";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { CreateDivisionButton } from "@components/create-division-button";
import { DeleteDivisionButton } from "@components/delete-division-button";
import { ExportDivisionsButton } from "@components/export-divisions-button";
import { ImportDivisionsButton } from "@components/import-divisions-button";
import { EditDivisionButton } from "./EditDivisionButton";
import { type DivisionsTable_DivisionListFragment$key } from "../../__generated__/DivisionsTable_DivisionListFragment.graphql";
import { type DivisionsTable_Query } from "../../__generated__/DivisionsTable_Query.graphql";
import { type DivisionsTable_Refetch } from "../../__generated__/DivisionsTable_Refetch.graphql";
import { type DivisionFilters, selectDivisionFilters } from "../../redux/DivisionSlice";
import { TkDataTable } from "../ui/TkDataTable";

const QUERY = graphql`
	query DivisionsTable_Query($first: Int, $filterByName: String) {
		...DivisionsTable_DivisionListFragment
			@arguments(first: $first, filterByName: $filterByName)
	}
`;

const PROJECTS_FRAGMENT = graphql`
	fragment DivisionsTable_DivisionListFragment on Query
	@refetchable(queryName: "DivisionsTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 20 }
		after: { type: "String" }
		filterByName: { type: "String" }
	) {
		Division {
			Divisions(first: $first, after: $after, filterByName: $filterByName)
				@connection(key: "DivisionsTable_Divisions") {
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
						...EditDivisionButton_DivisionFragment
					}
				}
			}
		}
	}
`;

export const DivisionsTable = () => {
	const filters = useSelector(selectDivisionFilters);

	const [initialLoad, setInitialLoadComplete] = useState(true);
	const data = useLazyLoadQuery<DivisionsTable_Query>(QUERY, { first: 20, ...filters });

	const {
		data: {
			Division: {
				Divisions: { __id, edges: divisions },
			},
		},
		hasNext,
		refetch,
		loadNext,
	} = usePaginationFragment<DivisionsTable_Refetch, DivisionsTable_DivisionListFragment$key>(
		PROJECTS_FRAGMENT,
		data,
	);

	const debouncedRefetch = (filters: DivisionFilters) => {
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
				<ImportDivisionsButton />
				<ExportDivisionsButton />
				<CreateDivisionButton connectionId={__id} />
				<DeleteDivisionButton
					divisionIds={selection.map((s) => s.id)}
					connectionIds={[__id]}
				/>
			</div>
			<TkDataTable
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are not divisions yet.</div>
					</div>
				}
				className="mb-3"
				value={divisions?.map((b) => b!.node!) as any[]}
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
					header="Actions"
					body={(row) => {
						return (
							<div>
								<EditDivisionButton className="mr-2" divisionFragmentRef={row} />
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
