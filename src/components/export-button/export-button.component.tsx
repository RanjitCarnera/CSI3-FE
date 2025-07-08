import { Button } from "@thekeytechnology/framework-react-components";
import { type ExportButtonProps } from "@components/export-button/export-button.types";

export const ExportButton = ({ isExporting, doExport }: ExportButtonProps) => {
	const handleOnClick = () => {
		doExport((fileUrl) => {
			window.open(fileUrl, "_blank");
		});
	};
	return (
		<Button
			content={{
				label: isExporting ? "Export in progress..." : "Export",
				icon: "pi pi-cloud-download",
				iconPosition: "left",
			}}
			disabled={isExporting}
			onClick={handleOnClick}
		/>
	);
};
