import { useState } from "react";
import { useSelector } from "react-redux";
import { ImportModal, type ImportResult } from "./ImportModal";
import { TkButton } from "./TkButton";
import { type Permission } from "../../__generated__/PermissionsField_Query.graphql";
import { selectHasPermissions } from "../../redux/CurrentUserSlice";

interface OwnProps2 {
	className?: string;
	isImporting: boolean;
	permission: Permission;
	doImport: (fileId: string, onCompleted: (result?: ImportResult) => void) => void;
}

export const ImportButton = ({ className, isImporting, permission, doImport }: OwnProps2) => {
	const [result, setResult] = useState<ImportResult | undefined>(undefined);
	const hasPermissions = useSelector(selectHasPermissions);
	const hasPermission = hasPermissions([permission]);

	const [isVisible, setVisible] = useState(false);
	return hasPermission ? (
		<>
			<TkButton
				className={className}
				icon="pi pi-cloud-upload"
				iconPos="left"
				label={isImporting ? "Importing..." : "Import"}
				onClick={() => {
					setVisible(true);
				}}
			/>

			<ImportModal
				result={result}
				onImportSelected={(id, success) => {
					doImport(id, (result) => {
						setResult(result);
						success();
					});
				}}
				isVisible={isVisible}
				onHide={() => {
					setResult(undefined);
					setVisible(false);
				}}
			/>
		</>
	) : null;
};
