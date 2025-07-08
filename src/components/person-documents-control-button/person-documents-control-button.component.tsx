import {
	type personDocumentsControlButton_DocumentInlineFragment$data,
	type personDocumentsControlButton_DocumentInlineFragment$key,
} from "@relay/personDocumentsControlButton_DocumentInlineFragment.graphql";
import { type personDocumentsControlButton_PersonFragment$key } from "@relay/personDocumentsControlButton_PersonFragment.graphql";
import { type personDocumentsControlButton_SetPersonsDocumentsMutation } from "@relay/personDocumentsControlButton_SetPersonsDocumentsMutation.graphql";
import { Button } from "@thekeytechnology/framework-react-components";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Image } from "primereact/image";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useFragment, useMutation } from "react-relay";
import { Conditional } from "@components/conditional";
import { type PersonDocumentsControlButtonProps } from "@components/person-documents-control-button/person-documents-control-button.types";
import { TaggedFileSelectionField } from "@components/relay/FileSelectionField";
import { TkButtonLink } from "@components/ui/TkButtonLink";
import { TkDialog } from "@components/ui/TkDialog";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import {
	DOCUMENT_INLINE_FRAGMENT,
	PERSON_FRAGMENT,
	SET_PERSONS_DOCUMENTS_MUTATION,
} from "./person-documents-control-button.graphql";

export const PersonDocumentsControlButton = ({
	personFragmentRef,
}: PersonDocumentsControlButtonProps) => {
	const person = useFragment<personDocumentsControlButton_PersonFragment$key>(
		PERSON_FRAGMENT,
		personFragmentRef,
	);
	const documents = useMemo(
		() =>
			person.documents.map(
				(doc) =>
					readInlineData<personDocumentsControlButton_DocumentInlineFragment$key>(
						DOCUMENT_INLINE_FRAGMENT,
						doc,
					) ?? [],
			),
		[person.documents],
	);
	const [commit] = useMutation<personDocumentsControlButton_SetPersonsDocumentsMutation>(
		SET_PERSONS_DOCUMENTS_MUTATION,
	);
	const [isVisible, setIsVisible] = useState(false);
	const hasPermissions = useSelector(selectHasPermissions);
	const title = `Documents: ${person.name}`;

	const hasDocumentReadPermission = hasPermissions([
		"UserInAccountPermission_PersonDocument_Read",
	]);
	const hasDocumentWritePermission = hasPermissions([
		"UserInAccountPermission_PersonDocument_Write",
	]);

	const createDownloadOnClickHandler = (url?: string | null) => () => {
		if (!url) return;
		window.open(url, "_blank");
	};
	const createDeleteOnClickHandler = (id?: string) => () => {
		setIsInFlight(true);
		commit({
			variables: {
				input: {
					personId: person.id,
					documentIds: [...documents.map((e) => e.id)].filter((e) => e !== id),
				},
			},
			onCompleted: () => {
				setIsInFlight(false);
			},
			onError: () => {
				setIsInFlight(false);
			},
		});
	};

	const [isInFlight, setIsInFlight] = useState(false);

	if (!hasDocumentReadPermission && !hasDocumentWritePermission) return null;

	return (
		<>
			<TkButtonLink
				icon="pi pi-folder-open"
				iconPos="left"
				label="Documents"
				onClick={() => {
					setIsVisible(true);
				}}
			/>
			<TkDialog
				onHide={() => {
					setIsVisible(false);
				}}
				visible={isVisible}
				dismissableMask={true}
				header={<h1>{title}</h1>}
			>
				<div className={"flex flex-column gap-4"}>
					<Conditional.Root
						condition={hasDocumentReadPermission || hasDocumentWritePermission}
					>
						<Conditional.Success>
							<div>
								<div className={"flex gap-2"}>
									<Conditional.Root condition={person.documents.length > 0}>
										<Conditional.Success>
											<DataTable
												value={documents}
												tableStyle={{ minWidth: "50rem" }}
											>
												<Column
													body={(
														row: personDocumentsControlButton_DocumentInlineFragment$data,
													) => {
														if (!row.thumbnail) return null;
														return (
															<Image
																src={row.thumbnail ?? ""}
																zoomSrc={row.url ?? ""}
																alt={row.name}
																width={"80"}
																height={"80"}
																preview
															/>
														);
													}}
													header="Preview"
												></Column>
												<Column
													body={(
														row: personDocumentsControlButton_DocumentInlineFragment$data,
													) => row.name}
													header="Name"
												></Column>
												<Column
													body={(
														row: personDocumentsControlButton_DocumentInlineFragment$data,
													) => {
														return row.fileType;
													}}
													header="File type"
												></Column>
												<Column
													body={(
														row: personDocumentsControlButton_DocumentInlineFragment$data,
													) => {
														return (
															<>
																<Button
																	inputVariant={"subtle"}
																	content={{
																		label: "Download",
																		icon: "pi pi-download",
																		iconPosition: "left",
																	}}
																	onClick={createDownloadOnClickHandler(
																		row.url,
																	)}
																/>
																<Button
																	inputVariant={"subtle"}
																	disabled={isInFlight}
																	content={{
																		label: "Delete",
																		icon: "pi pi-trash",
																		iconPosition: "left",
																	}}
																	onClick={createDeleteOnClickHandler(
																		row.id,
																	)}
																/>
															</>
														);
													}}
													header="Actions"
												></Column>
											</DataTable>
										</Conditional.Success>
										<Conditional.Fallback>No documents.</Conditional.Fallback>
									</Conditional.Root>
								</div>
							</div>
						</Conditional.Success>
					</Conditional.Root>

					<Conditional.Root condition={hasDocumentWritePermission}>
						<Conditional.Success>
							<div>
								<h4>Upload new document</h4>
								<Field
									excludeIds={documents.map((e) => e.id)}
									fieldValue={""}
									updateField={(newValue) => {
										if (!newValue) return;
										commit({
											variables: {
												input: {
													personId: person.id,
													documentIds: [
														...documents.map((e) => e.id),
														newValue,
													],
												},
											},
										});
									}}
								/>
							</div>
						</Conditional.Success>
					</Conditional.Root>
				</div>
			</TkDialog>
		</>
	);
};

const Field = TaggedFileSelectionField(["Documents"], ".jpg,.png,.xlsx,.pdf,.docx,.doc");
