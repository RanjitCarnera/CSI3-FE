import { useMutation } from "react-relay";
import { IMPORT_SKILL_CATEGORIES_MUTATION } from "@components/import-skill-categories-button/import-skill-categories-button.graphql";
import { type importSkillCategoriesButton_ImportSkillCategoriesMutation } from "@relay/importSkillCategoriesButton_ImportSkillCategoriesMutation.graphql";
import { ImportButton } from "../ui/ImportButton";

export const ImportSkillCategoriesButton = () => {
	const [doImport, isImporting] =
		useMutation<importSkillCategoriesButton_ImportSkillCategoriesMutation>(
			IMPORT_SKILL_CATEGORIES_MUTATION,
		);
	return (
		<ImportButton
			isImporting={isImporting}
			permission={"UserInAccountPermission_Skills_Edit"}
			doImport={(fileId, onCompleted) => {
				doImport({
					variables: { input: { fileId } },
					onCompleted: (result) => {
						onCompleted(result.Skills.importSkillCategories?.result);
					},
				});
			}}
		/>
	);
};
