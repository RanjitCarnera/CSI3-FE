import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readInlineData, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { useLocation } from "react-router-dom";
import {
	type PeopleFilters,
	selectPeopleFilters,
	selectPeopleSelection,
	setPeopleConnectionId,
	setPeopleSelection,
} from "@redux/PeopleSlice";
import { type activatedPeopleTable_PersonInlineFragment$key } from "@relay/activatedPeopleTable_PersonInlineFragment.graphql";
import { type activatedPeopleTable_Query } from "@relay/activatedPeopleTable_Query.graphql";
import { type activatedPeopleTable_QueryFragment$key } from "@relay/activatedPeopleTable_QueryFragment.graphql";
import { type PeopleTable_Refetch } from "@relay/PeopleTable_Refetch.graphql";
import { PeopleTable } from "@screens/people/parts/people-table";
import { PERSON_INLINE_FRAGMENT, QUERY, QUERY_FRAGMENT } from "./activated-people-table.graphql";

export const PeopleTableWithQuery = memo(({ activationStatus }: { activationStatus: boolean }) => {
	const location = useLocation();
	const filters = useSelector(selectPeopleFilters);
	const castedLocationState = location.state as { personRef?: string };

	const [initialLoad, setInitialLoadComplete] = useState(true);
	const data = useLazyLoadQuery<activatedPeopleTable_Query>(QUERY, {
		first: 250,
		activationStatus,
		...filters,
		alwaysIncludeId: castedLocationState.personRef
			? [castedLocationState.personRef]
			: undefined,
	});

	const {
		data: {
			Staff: {
				People: { __id, edges: people },
			},
		},
		hasNext,
		refetch,
		loadNext,
	} = usePaginationFragment<PeopleTable_Refetch, activatedPeopleTable_QueryFragment$key>(
		QUERY_FRAGMENT,
		data,
	);

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(setPeopleConnectionId(__id));
	}, [__id]);
	useEffect(() => {
		dispatch(setPeopleSelection([]));
	}, [people]);

	const debouncedRefetch = useCallback(
		(filters: PeopleFilters) => {
			refetch(
				{
					...filters,
					first: 250,
					alwaysIncludeIds: castedLocationState.personRef
						? [castedLocationState.personRef]
						: undefined,
				},
				{ fetchPolicy: "network-only" },
			);
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

	const selection = useSelector(selectPeopleSelection);

	const peopleData = useMemo(
		() =>
			people?.map((b) =>
				readInlineData<activatedPeopleTable_PersonInlineFragment$key>(
					PERSON_INLINE_FRAGMENT,
					b!.node!,
				),
			) ?? [],
		[people],
	);

	return (
		<>
			<PeopleTable
				peopleData={peopleData}
				selection={selection}
				setSelection={(e) => {
					dispatch(setPeopleSelection(e));
				}}
				hasNext={hasNext}
				loadNext={loadNext}
				autoFocusPersonRef={castedLocationState.personRef}
			/>
		</>
	);
});
