import { graphql } from "babel-plugin-relay/macro";
import { useLazyLoadQuery } from "react-relay";
import { personDetailsModalContent_Query } from "@relay/personDetailsModalContent_Query.graphql";
import { PersonDetailsControl } from "@components/person-details-button/parts/person-details-control";

const QUERY = graphql`
	query personDetailsModalContent_Query($personId: ID!, $scenarioId: ID!) {
		node(id: $personId) {
			... on Person {
				...personDetailsControl_PersonFragment @arguments(scenarioId: $scenarioId)
			}
		}
		...personDetailsControl_AssignmentListFragment
			@arguments(filterByPerson: $personId, filterByScenario: $scenarioId)
	}
`;

interface OwnProps {
	personId: string;
	scenarioId: string;
}

export const PersonDetailsModalContent = ({ personId, scenarioId }: OwnProps) => {
	const query = useLazyLoadQuery<personDetailsModalContent_Query>(
		QUERY,
		{
			personId,
			scenarioId,
		},
		{ fetchPolicy: "network-only" },
	);
	return <PersonDetailsControl personFragmentRef={query.node!} assignmentsFragmentRef={query} />;
};
