import { graphql } from "babel-plugin-relay/macro";

export const PERSON_FRAGMENT = graphql`
	fragment editPersonSkillAssociationsButton_PersonFragment on Person {
		name
		...editPersonSkillAssociationsModalContent_PersonFragment
	}
`;
