import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { TkDialog } from "./TkDialog";
import { TkButtonLink } from "./TkButtonLink";
import { ValidatedField } from "./ValidatedField";
import { TaggedFileSelectionField } from "../relay/FileSelectionField";
import { TkMessage } from "./TkMessage";
import { Form } from "@thekeytechnology/framework-react-components";

export interface ImportResult {
	readonly editedEntities: number;
	readonly issues: ReadonlyArray<{
		readonly issue: string;
		readonly row: number;
	}>;
	readonly newEntities: number;
}

interface OwnProps {
	onImportSelected: (id: string, success: () => void) => void;
	result?: ImportResult;

	isVisible: boolean;
	onHide: () => void;
}

interface FormState {
	fileId?: string;
}

export const ImportModal = ({ onImportSelected, result, isVisible, onHide }: OwnProps) => {
	const formik = useFormik<FormState>({
		initialValues: {
			fileId: "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			fileId: Yup.string().required("File is a required field."),
		}),
		onSubmit: (values, { setSubmitting, resetForm }) => {
			onImportSelected(values.fileId!, () => {
				setSubmitting(false);
				resetForm({});
			});
		},
	});

	return (
		<TkDialog
			dismissableMask={false}
			header={<h1>Import file</h1>}
			visible={isVisible}
			onHide={() => {
				if (result) {
					window.location.reload();
				} else {
					onHide();
				}
			}}
			footer={
				<div className="flex">
					<TkButtonLink
						disabled={formik.isSubmitting}
						type="button"
						onClick={() => {
							if (result) {
								window.location.reload();
							} else {
								onHide();
							}
						}}
						label={"Cancel"}
						className="m-auto w-auto"
					/>
					<TkButtonLink
						disabled={formik.isSubmitting}
						onClick={() => formik.handleSubmit()}
						label={formik.isSubmitting ? "Importing..." : "Import"}
						className="m-auto w-auto"
					/>
				</div>
			}
		>
			{result ? (
				<TkMessage
					className="mb-3 w-12"
					content={
						<div>
							<h3 className="mt-0">Import results</h3>
							<div>
								<strong>{result.newEntities}</strong> newly imported.
							</div>
							<div>
								<strong>{result.editedEntities}</strong> updated.
							</div>
							{result.issues.length > 0 && (
								<>
									<h4>Import issues</h4>
									{result.issues.map((issue) => (
										<div>
											<strong>Row {issue.row}: </strong>
											{issue.issue}
										</div>
									))}
								</>
							)}
						</div>
					}
				/>
			) : (
				<TkMessage
					className="mb-3 w-12"
					content={
						<div>
							The format for import files can be easily extracted from an export.
							Ideally you create a few items manually, then export and use the
							resulting file as a basis for your import.
						</div>
					}
				/>
			)}

			<Form onSubmit={formik.handleSubmit}>
				<ValidatedField<FormState, string>
					className="mb-4"
					name={"fileId"}
					label={"File"}
					required={true}
					formikConfig={formik}
					component={TaggedFileSelectionField(["import"], ".xlsx")}
				/>
			</Form>
		</TkDialog>
	);
};
