import { graphql } from "babel-plugin-relay/macro";

export const PROJECT_IN_SCENARIO_FRAGMENT = graphql`
	fragment projectDetailsControl_ProjectInScenarioFragment on ProjectInScenario {
		id
		project {
			id
			name
			startDate
			endDate
			skills {
				name
			}
			address {
				lineOne
				postalCode
				city
				country
				state
				latitude
				longitude
			}
			avatar {
				url
			}
			skillMatrixByCategories {
				...projectDetailsControl_CategoryWithMatrixTypeInlineFragment
			}
			...ProjectDateTimeDisplay_ProjectFragment
		}
	}
`;

export const CATEGORY_WITH_MATRIX_TYPE_INLINE_FRAGMENT = graphql`
	fragment projectDetailsControl_CategoryWithMatrixTypeInlineFragment on CategoryWithMatrixType
	@inline {
		matrix {
			columns {
				key
			}
			headerRow {
				key
				entries {
					id
					name
					skillCategory {
						id
						name
					}
				}
			}
			bodyRows {
				key
				entries {
					value {
						id
						data {
							value {
								kind
								... on BinaryAssessmentValue {
									hasSkill
									kind
								}
								... on NumericalAssessmentValue {
									kind
									number
								}
							}
							skill {
								id
								name
								dimension {
									kind
									... on NumericalDimension {
										dimensionCount
										kind
									}
									... on BinaryDimension {
										kind
									}
								}
							}
						}
					}
				}
			}
		}
		category {
			id
			name
		}
	}
`;
