import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readInlineData, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { PROJECT_INLINE_FRAGMENT } from "@components/relay/ProjectsTable";
import {
	type ProjectFilters,
	selectProjectFilters,
	selectProjectSelection,
	setConnectionId,
	setSelection,
} from "@redux/ProjectSlice";
import { type deactivatedProjectsTable_ProjectsListFragment$key } from "@relay/deactivatedProjectsTable_ProjectsListFragment.graphql";
import { type deactivatedProjectsTable_Query } from "@relay/deactivatedProjectsTable_Query.graphql";
import { type deactivatedProjectsTable_Refetch } from "@relay/deactivatedProjectsTable_Refetch.graphql";
import type { ProjectsTable_ProjectFragment$key } from "@relay/ProjectsTable_ProjectFragment.graphql";
import { Table } from "@screens/projects/parts/table/table.component";
import { QUERY, QUERY_FRAGMENT } from "./deactivated-projects-table.graphql";

export const DeactivatedProjectsTable = () => {
	const filters = useSelector(selectProjectFilters);
	const selection = useSelector(selectProjectSelection);
	const query = useLazyLoadQuery<deactivatedProjectsTable_Query>(QUERY, {
		activationStatus: false,
		...filters,
	});
	const [initialLoad, setInitialLoadComplete] = useState(true);

	const {
		data: {
			Project: {
				Projects: { __id, edges },
			},
		},
		refetch,
		hasNext,
		loadNext,
	} = usePaginationFragment<
		deactivatedProjectsTable_Refetch,
		deactivatedProjectsTable_ProjectsListFragment$key
	>(QUERY_FRAGMENT, query);

	const debouncedRefetch = (filters: ProjectFilters) => {
		refetch({ ...filters, first: 200 }, { fetchPolicy: "store-and-network" });
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
			setSelection([]);
			debouncedEventHandler(filters);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters]);

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(setConnectionId(__id));
	}, [__id]);

	useEffect(() => {
		dispatch(setSelection([]));
	}, [edges]);

	const projects =
		edges?.map((b) =>
			readInlineData<ProjectsTable_ProjectFragment$key>(PROJECT_INLINE_FRAGMENT, b!.node!),
		) ?? [];

	return (
		<Table
			projectsData={projects}
			selection={selection}
			hasNext={hasNext}
			setSelection={(ids) => {
				dispatch(setSelection(ids));
			}}
			loadNext={loadNext}
		/>
	);
};
