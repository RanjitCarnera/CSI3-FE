import { graphql } from "babel-plugin-relay/macro";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Fragment } from "react";
import { useLazyLoadQuery } from "react-relay";
import { match } from "ts-pattern";
import { type SkillFilter } from "@relay/RosterList_StaffRefetch.graphql";
import { type SkillsSelect_Query } from "../../__generated__/SkillsSelect_Query.graphql";
import { TkButtonLink } from "../ui/TkButtonLink";
import { type ValidatedFieldConfig } from "../ui/ValidatedField";

const QUERY = graphql`
	query SkillsSelect_Query($filterBySkillCategoryRef: ID) {
		Skills {
			Skills(first: 250, filterBySkillCategoryRef: $filterBySkillCategoryRef) {
				edges {
					node {
						id
						name
						dimension {
							kind
							... on BinaryDimension {
								kind
							}
							... on NumericalDimension {
								kind
								dimensionCount
							}
						}
					}
				}
			}
		}
	}
`;

export const SkillsSelect = ({
	filterBySkillCategoryRef,
	fieldValue,
	updateField,
	placeholder,
}: ValidatedFieldConfig<SkillFilter[]> & { filterBySkillCategoryRef?: string }) => {
	const {
		Skills: {
			Skills: { edges: skillEdges },
		},
	} = useLazyLoadQuery<SkillsSelect_Query>(QUERY, { filterBySkillCategoryRef });
	const allSkills = skillEdges?.map((s) => s!.node!) ?? [];
	const currentFieldValue = fieldValue ?? [];

	return (
		<div className="flex flex-column">
			<Dropdown
				options={allSkills
					.filter((as) => !currentFieldValue.map((v) => v.skillId).includes(as.id))
					.map((skill) => ({
						label: skill.name,
						name: skill.name,
						value: skill.id,
					}))}
				placeholder={placeholder}
				onChange={(e) => {
					updateField([...currentFieldValue, { skillId: e.value }]);
				}}
			/>

			{currentFieldValue.length > 0 && <h4>Selected skills</h4>}

			<div
				className="flex-shrink-1 overflow-y-auto overflow-x-hidden"
				style={{ maxHeight: "40vh" }}
			>
				{[...(currentFieldValue || [])]
					?.sort((x, y) => x.skillId.localeCompare(y.skillId))
					.map((filter) => {
						const currentValue = currentFieldValue.find(
							(f) => f.skillId === filter.skillId,
						);
						const allOtherSkillFilters = currentFieldValue.filter(
							(f) => f.skillId !== filter.skillId,
						);
						const currentSkill = allSkills.find((s) => s.id === filter.skillId);
						return (
							<div className="grid mb-3" key={filter.skillId}>
								<div className="flex col-12 align-items-center">
									<small style={{ wordBreak: "break-word" }}>
										Skill: {currentSkill?.name}
									</small>
									<TkButtonLink
										style={{ minWidth: 85 }}
										className="ml-auto w-auto"
										label="Remove"
										onClick={() => {
											updateField(
												allOtherSkillFilters.length
													? allOtherSkillFilters
													: undefined,
											);
										}}
									/>
								</div>
								{currentValue &&
									match(currentSkill?.dimension.kind)
										.with("binary", () => (
											<div className="col-12">
												<TriStateCheckbox
													value={filter.hasSkillOpt}
													onChange={(e) => {
														updateField([
															...allOtherSkillFilters,
															{
																skillId: currentValue?.skillId,
																minOpt: currentValue.minOpt,
																maxOpt: currentValue.maxOpt,
																hasSkillOpt:
																	e.value === true
																		? true
																		: e.value === false
																		? false
																		: undefined,
															},
														]);
													}}
												/>
											</div>
										))
										.with("numerical", () => (
											<>
												<div className="col-6">
													<InputNumber
														value={filter.minOpt}
														onChange={(e) => {
															updateField([
																...allOtherSkillFilters,
																{
																	skillId: currentValue?.skillId,
																	minOpt:
																		e.value !== undefined &&
																		e.value !== null
																			? e.value
																			: undefined,
																	maxOpt: currentValue?.maxOpt,
																},
															]);
														}}
														placeholder={"Minimum"}
													/>
												</div>
												<div className="col-6">
													<InputNumber
														value={filter.maxOpt}
														onChange={(e) => {
															updateField([
																...allOtherSkillFilters,
																{
																	skillId: currentValue?.skillId,
																	minOpt: currentValue.minOpt,
																	maxOpt:
																		e?.value !== undefined &&
																		e.value !== null
																			? e.value
																			: undefined,
																},
															]);
														}}
														placeholder={"Maximum"}
													/>
												</div>
											</>
										))
										.otherwise(() => <Fragment />)}
							</div>
						);
					})}
			</div>
		</div>
	);
};
