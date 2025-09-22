import graphql from "babel-plugin-relay/macro";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readInlineData, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { Table } from "@screens/projects/parts/table/table.component";
import { type ProjectsTable_ProjectFragment$key } from "../../__generated__/ProjectsTable_ProjectFragment.graphql";
import { type ProjectsTable_ProjectsListFragment$key } from "../../__generated__/ProjectsTable_ProjectsListFragment.graphql";
import { type ProjectsTable_Query } from "../../__generated__/ProjectsTable_Query.graphql";
import { type ProjectsTable_Refetch } from "../../__generated__/ProjectsTable_Refetch.graphql";
import {
	type ProjectFilters,
	selectProjectFilters,
	selectProjectSelection,
	setConnectionId,
	setSelection,
} from "../../redux/ProjectSlice";

const QUERY = graphql`
	query ProjectsTable_Query(
		$first: Int
		$filterByName: String
		$filterByRegions: [ID!]
		$filterByDivisions: [ID!]
		$filterByStages: [ID!]
		$activationStatus: Boolean
	) {
		...ProjectsTable_ProjectsListFragment
			@arguments(
				first: $first
				filterByName: $filterByName
				filterByRegions: $filterByRegions
				filterByDivisions: $filterByDivisions
				filterByStages: $filterByStages
				activationStatus: $activationStatus
			)
	}
`;

const PROJECTS_FRAGMENT = graphql`
	fragment ProjectsTable_ProjectsListFragment on Query
	@refetchable(queryName: "ProjectsTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 200 }
		after: { type: "String" }
		filterByName: { type: "String" }
		filterByRegions: { type: "[ID!]" }
		filterByDivisions: { type: "[ID!]" }
		filterByStages: { type: "[ID!]" }
		activationStatus: { type: "Boolean" }
	) {
		Project {
			Projects(
				first: $first
				after: $after
				filterByName: $filterByName
				filterByRegions: $filterByRegions
				filterByDivisions: $filterByDivisions
				filterByStages: $filterByStages
				activationStatus: $activationStatus
			) @connection(key: "ProjectsTable_Projects") {
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
						...ProjectsTable_ProjectFragment
					}
				}
			}
		}
	}
`;

export const PROJECT_INLINE_FRAGMENT = graphql`
	fragment ProjectsTable_ProjectFragment on Project @inline {
		id
		name
		isDeactivated
		source

		division {
			id
			name
		}
		region {
			id
			name
		}
		startDate
		endDate

		stage {
			id
			name
		}

		address {
			latitude
			longitude
			...GoogleMapsClickout_AddressFragment
		}

		avatar {
			id
			url
		}

		...editProjectButton_ProjectFragment
		...ChangeProjectActivationButton_ProjectFragment
		...syncProjectFromDynamicsButton_ProjectFragment
		...syncProjectFromRandButton_ProjectFragment
	}
`;

export const ProjectsTable = () => {
	const filters = useSelector(selectProjectFilters);
	const selection = useSelector(selectProjectSelection);
	const [initialLoad, setInitialLoadComplete] = useState(true);
	const data = useLazyLoadQuery<ProjectsTable_Query>(QUERY, {
		first: 200,
		...filters,
		activationStatus: true,
	});
	const {
		data: {
			Project: {
				Projects: { __id, edges },
			},
		},
		hasNext,
		refetch,
		loadNext,
	} = usePaginationFragment<ProjectsTable_Refetch, ProjectsTable_ProjectsListFragment$key>(
		PROJECTS_FRAGMENT,
		data,
	);

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
			dispatch(setSelection([]));
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
