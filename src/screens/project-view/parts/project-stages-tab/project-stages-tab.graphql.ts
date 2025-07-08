import { graphql } from "babel-plugin-relay/macro";

export const QUERY_FRAGMENT = graphql`
	fragment projectStagesTabs_ProjectStages on Query {
		Project {
			ProjectStages(first: 100) {
				edges {
					node {
						id
						name
						sortOrder
						...projectStagesTab_ProjectStageFragment
						...projectStagesTab_ProjectStageInlineFragment
					}
				}
			}
		}
	}
`;
const PROJECT_STAGE_FRAGMENT = graphql`
	fragment projectStagesTab_ProjectStageFragment on ProjectStage {
		id
		name
		sortOrder
	}
`;

export const PROJECT_STAGE_INLINE_FRAGMENT = graphql`
	fragment projectStagesTab_ProjectStageInlineFragment on ProjectStage @inline {
		id
		name
		sortOrder
	}
`;
