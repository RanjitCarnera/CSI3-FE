import { useMutation } from "react-relay";
import { ExportButton } from "@components/export-button";
import { EXPORT_SKILL_CATEGORIES_MUTATION } from "@components/export-skill-categories-button/export-skill-categories-button.graphql";
import { type exportSkillCategoriesButton_ExportSkillCategoriesMutation } from "@relay/exportSkillCategoriesButton_ExportSkillCategoriesMutation.graphql";

/**
 * TODO
 * 1. search for 'import { ExportButton } from "@' and refactor each file (graphql out)
 * 2. double check if those files have the proper formatting due to missing classNames
 */
export const ExportSkillCategoriesButton = () => {
	const [doExport, isExporting] =
		useMutation<exportSkillCategoriesButton_ExportSkillCategoriesMutation>(
			EXPORT_SKILL_CATEGORIES_MUTATION,
		);
	return (
		<ExportButton
			isExporting={isExporting}
			doExport={(success) => {
				doExport({
					variables: {},
					onCompleted: (response) => {
						success(response.Skills.exportSkillCategories?.file?.url!);
					},
				});
			}}
		/>
	);
};
