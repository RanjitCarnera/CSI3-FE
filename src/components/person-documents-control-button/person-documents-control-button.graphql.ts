import { graphql } from "babel-plugin-relay/macro";

export const PERSON_FRAGMENT = graphql`
	fragment personDocumentsControlButton_PersonFragment on Person {
		id
		name
		documents {
			...personDocumentsControlButton_DocumentInlineFragment
		}
	}
`;

export const DOCUMENT_INLINE_FRAGMENT = graphql`
	fragment personDocumentsControlButton_DocumentInlineFragment on File @inline {
		id
		url
		fileType
		name
		fileSize
		thumbnail
	}
`;

export const SET_PERSONS_DOCUMENTS_MUTATION = graphql`
	mutation personDocumentsControlButton_SetPersonsDocumentsMutation(
		$input: SetPersonsDocumentsInput!
	) {
		Staff {
			setPersonsDocuments(input: $input) {
				edge {
					node {
						id
						...personDocumentsControlButton_PersonFragment
					}
				}
			}
		}
	}
`;
