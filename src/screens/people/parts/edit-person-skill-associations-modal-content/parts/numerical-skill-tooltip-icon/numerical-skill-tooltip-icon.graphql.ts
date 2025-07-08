import { graphql } from "babel-plugin-relay/macro";

export const SKILL_FRAGMENT = graphql`
	fragment numericalSkillTooltipIcon_SkillFragment on Skill {
		dimension {
			kind
			... on NumericalDimension {
				dimensionExplanations
				dimensionCount
			}
		}
	}
`;
