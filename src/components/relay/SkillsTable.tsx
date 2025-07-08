import graphql from "babel-plugin-relay/macro";
import debounce from "lodash.debounce";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
	useLazyLoadQuery,
	usePaginationFragment,
	useSubscribeToInvalidationState,
} from "react-relay";
import { CreateSkillButton } from "@components/relay/create-skill-button/create-skill-button.component";
import { EditSkillButton } from "@components/relay/edit-skill-button";
import { DeleteSkillsButton } from "./DeleteSkillsButton";
import { ExportSkillsButton } from "./ExportSkillsButton";
import { ImportSkillsButton } from "./ImportSkillsButton";
import { type SkillsTable_Query } from "../../__generated__/SkillsTable_Query.graphql";
import { type SkillsTable_Refetch } from "../../__generated__/SkillsTable_Refetch.graphql";
import { type SkillsTable_SkillsListFragment$key } from "../../__generated__/SkillsTable_SkillsListFragment.graphql";
import { selectSkillFilters, type SkillFilters } from "../../redux/SkillCategroySlice";
import { TkDataTable } from "../ui/TkDataTable";

const QUERY = graphql`
	query SkillsTable_Query($first: Int, $filterByName: String, $filterBySkillCategoryRef: ID) {
		...SkillsTable_SkillsListFragment
			@arguments(
				first: $first
				filterByName: $filterByName
				filterBySkillCategoryRef: $filterBySkillCategoryRef
			)
	}
`;

const PROJECTS_FRAGMENT = graphql`
	fragment SkillsTable_SkillsListFragment on Query
	@refetchable(queryName: "SkillsTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 20 }
		after: { type: "String" }
		filterByName: { type: "String" }
		filterBySkillCategoryRef: { type: "ID" }
	) {
		Skills {
			Skills(
				first: $first
				after: $after
				filterByName: $filterByName
				filterBySkillCategoryRef: $filterBySkillCategoryRef
			) @connection(key: "SkillsTable_Skills") {
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
						skillCategory {
							id
							name
							sortOrder
						}
						...editSkillButton_SkillFragment
					}
				}
			}
		}
	}
`;

export const SkillsTable = () => {
	const filters = useSelector(selectSkillFilters);

	const [initialLoad, setInitialLoadComplete] = useState(true);
	const data = useLazyLoadQuery<SkillsTable_Query>(
		QUERY,
		{ first: 20, ...filters },
		{ fetchPolicy: "network-only" },
	);

	const {
		data: {
			Skills: {
				Skills: { __id, edges: skillCategories },
			},
		},
		hasNext,
		refetch,
		loadNext,
	} = usePaginationFragment<SkillsTable_Refetch, SkillsTable_SkillsListFragment$key>(
		PROJECTS_FRAGMENT,
		data,
	);

	const debouncedRefetch = (filters: SkillFilters) => {
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

	useSubscribeToInvalidationState(["client:root:Skills"], () => {
		refetch({ ...filters, first: 20 });
	});

	return (
		<>
			<div className="flex justify-content-end gap-2">
				<ImportSkillsButton />
				<ExportSkillsButton />
				<CreateSkillButton connectionId={__id} />
				<DeleteSkillsButton skillIds={selection.map((s) => s.id)} connectionIds={[__id]} />
			</div>
			<TkDataTable
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are no skills yet.</div>
					</div>
				}
				className="mb-3"
				value={skillCategories?.map((b) => b!.node!)}
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
					header="Category"
					sortable
					sortField={"skillCategory.name"}
					body={(row) => {
						return row.skillCategory?.name;
					}}
				/>
				<Column
					header="Actions"
					body={(row) => {
						return (
							<div>
								<EditSkillButton connectionId={""} skillFragmentRef={row} />
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
