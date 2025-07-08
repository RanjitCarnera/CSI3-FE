import { graphql } from "babel-plugin-relay/macro";

export const IMPORT_PEOPLESOFT_BUTTON_MUTATION = graphql`
	mutation importPeoplesoftButton_DownloadPeopleDataFromS3Mutation(
		$input: DownloadPeopleDataFromS3Input!
	) {
		Peoplesoft {
			downloadPeopleDataFromS3(input: $input) {
				edited
				imported
				clientMutationId
			}
		}
	}
`;
