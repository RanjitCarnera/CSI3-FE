import { graphql } from "babel-plugin-relay/macro";
import React from "react";
import { useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type SkillCategorySortOrderButtons_AssignmentRoleFragment$key } from "../../__generated__/SkillCategorySortOrderButtons_AssignmentRoleFragment.graphql";
import { type SkillCategorySortOrderButtons_DecreaseMutation } from "../../__generated__/SkillCategorySortOrderButtons_DecreaseMutation.graphql";
import { type SkillCategorySortOrderButtons_IncreaseMutation } from "../../__generated__/SkillCategorySortOrderButtons_IncreaseMutation.graphql";
import { TkButtonLink } from "../ui/TkButtonLink";

const INCREASE_MUTATION = graphql`
	mutation SkillCategorySortOrderButtons_IncreaseMutation(
		$input: IncreaseSkillCategorySortOrderInput!
	) {
		Skills {
			increaseSkillCategorySortOrder(input: $input) {
				edge {
					node {
						id
						sortOrder
					}
				}
			}
		}
	}
`;

const DECREASE_MUTATION = graphql`
	mutation SkillCategorySortOrderButtons_DecreaseMutation(
		$input: DecreaseSkillCategorySortOrderInput!
	) {
		Skills {
			decreaseSkillCategorySortOrder(input: $input) {
				edge {
					node {
						id
						sortOrder
					}
				}
			}
		}
	}
`;

const FRAGMENT = graphql`
	fragment SkillCategorySortOrderButtons_AssignmentRoleFragment on SkillCategory {
		id
		name
		sortOrder
	}
`;

interface OwnProps {
	skillCategoryFragmentRef: SkillCategorySortOrderButtons_AssignmentRoleFragment$key;
}

export const SkillCategorySortOrderButtons = ({ skillCategoryFragmentRef }: OwnProps) => {
	const skillCategory = useFragment<SkillCategorySortOrderButtons_AssignmentRoleFragment$key>(
		FRAGMENT,
		skillCategoryFragmentRef,
	);
	const [increase, isIncreasing] =
		useMutation<SkillCategorySortOrderButtons_IncreaseMutation>(INCREASE_MUTATION);
	const [decrease, isDecreasing] =
		useMutation<SkillCategorySortOrderButtons_DecreaseMutation>(DECREASE_MUTATION);

	const hasPermissions = useSelector(selectHasPermissions);
	const hasPermission = hasPermissions([
		"UserInAccountPermission_Skills_Edit",
		"UserInAccountPermission_AssignmentRole_Edit",
	]);
	return (
		<div className="flex align-items-center">
			{hasPermission && (
				<TkButtonLink
					className="mr-2"
					disabled={isIncreasing || isDecreasing}
					icon="pi pi-chevron-up"
					onClick={() => {
						decrease({
							variables: { input: { id: skillCategory.id } },
							updater: (config) => {
								const skills = config.get("client:root:Skills");
								if (skills != null) {
									skills.invalidateRecord();
								}
							},
						});
					}}
				/>
			)}
			<div className="mr-2">{skillCategory.sortOrder}</div>
			{hasPermission && (
				<TkButtonLink
					disabled={isIncreasing || isDecreasing}
					icon="pi pi-chevron-down"
					onClick={() => {
						increase({
							variables: { input: { id: skillCategory.id } },
							updater: (config) => {
								const skills = config.get("client:root:Skills");
								if (skills != null) {
									skills.invalidateRecord();
								}
							},
						});
					}}
				/>
			)}
		</div>
	);
};
