import { graphql } from "babel-plugin-relay/macro";

export const PROJECT_FRAGMENT = graphql`
	fragment editProjectStageButton_ProjectStageFragment on ProjectStage {
		...editProjectStageModal_ProjectStageFragment
	}
`;
