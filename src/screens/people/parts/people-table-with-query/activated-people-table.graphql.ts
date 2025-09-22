import graphql from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query activatedPeopleTable_Query(
		$first: Int
		$filterByName: String
		$alwaysIncludeId: [ID!]
		$activationStatus: Boolean
	) {
		...activatedPeopleTable_QueryFragment
			@arguments(
				first: $first
				filterByName: $filterByName
				alwaysIncludeIds: $alwaysIncludeId
				activationStatus: $activationStatus
			)
	}
`;

export const QUERY_FRAGMENT = graphql`
	fragment activatedPeopleTable_QueryFragment on Query
	@refetchable(queryName: "PeopleTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 250 }
		after: { type: "String" }
		filterByName: { type: "String" }
		alwaysIncludeIds: { type: "[ID!]" }
		activationStatus: { type: "Boolean" }
	) {
		Staff {
			People(
				first: $first
				after: $after
				filterByName: $filterByName
				alwaysIncludeIds: $alwaysIncludeIds
				activationStatus: $activationStatus
			) @connection(key: "PeopleTable_People") {
				__id
				pageInfo {
					endCursor
					hasPreviousPage
					hasNextPage
					startCursor
				}
				edges {
					node {
						id
						...activatedPeopleTable_PersonInlineFragment
					}
				}
			}
		}
	}
`;

export const PERSON_INLINE_FRAGMENT = graphql`
	fragment activatedPeopleTable_PersonInlineFragment on Person @inline {
		id
		isDeactivated
		name
		address {
			longitude
			latitude
			...GoogleMapsClickout_AddressFragment
		}
		startDate
		assignmentRole {
			name
		}
		associatedWithDivisions {
			id
			name
		}
		associatedWithRegions {
			id
			name
		}
		skills(first: 100) {
			edges {
				node {
					id
					data {
						value {
							... on NumericalAssessmentValue {
								kind
								number
							}
							... on BinaryAssessmentValue {
								hasSkill
								kind
							}
						}
					}
				}
			}
		}
		avatar {
			url
		}
		documents {
			id
		}
		comment
		...EditPersonButton_PersonFragment
		...editPersonSkillAssociationsButton_PersonFragment
		...ChangePersonActivationButton_PersonFragment
		...personDocumentsControlButton_PersonFragment
	}
`;
