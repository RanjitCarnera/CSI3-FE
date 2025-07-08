import { graphql } from "babel-plugin-relay/macro";
import { useLazyLoadQuery } from "react-relay";
import { ProjectDetailsModalContent_Query } from "../../__generated__/ProjectDetailsModalContent_Query.graphql";
import { ProjectDetailsControl } from "./project-details-control";

const QUERY = graphql`
	query ProjectDetailsModalContent_Query($projectId: ID!, $scenarioId: ID!) {
		Scenario {
			ProjectInScenario(projectId: $projectId, scenarioId: $scenarioId) {
				...projectDetailsControl_ProjectInScenarioFragment
			}
		}
	}
`;

interface OwnProps {
	projectId: string;
	scenarioId: string;
}

export const ProjectDetailsModalContent = ({ projectId, scenarioId }: OwnProps) => {
	const query = useLazyLoadQuery<ProjectDetailsModalContent_Query>(
		QUERY,
		{
			projectId,
			scenarioId,
		},
		{ fetchPolicy: "network-only" },
	);
	return <ProjectDetailsControl projectFragmentRef={query.Scenario.ProjectInScenario!} />;
};
