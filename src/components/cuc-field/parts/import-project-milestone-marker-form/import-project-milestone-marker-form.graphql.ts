import { graphql } from "babel-plugin-relay/macro";

export const PROJECT_FRAGMENT = graphql`
	fragment importProjectMilestoneMarkerForm_ProjectFragment on Project {
		id
		milestones {
			id
			data {
				name
				date
			}
		}
	}
`;
