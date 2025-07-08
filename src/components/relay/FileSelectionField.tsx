import graphql from "babel-plugin-relay/macro";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { Suspense, useState } from "react";
import { useLazyLoadQuery } from "react-relay";
import { FilesTable } from "./FilesTable";
import { type FileSelectionField_Query } from "../../__generated__/FileSelectionField_Query.graphql";
import { TkDialog } from "../ui/TkDialog";
import { type ValidatedFieldConfig } from "../ui/ValidatedField";

const QUERY = graphql`
	query FileSelectionField_Query(
		$fileId: ID!
		$skip: Boolean!
		$filterByFileTypes: [String!]
		$tagsIncluded: [String!]
	) {
		...FilesTable_FilesListFragment
			@arguments(filterByFileTypes: $filterByFileTypes, tagsIncluded: $tagsIncluded)

		node(id: $fileId) @skip(if: $skip) {
			... on File {
				name
				url
			}
		}
	}
`;

interface OwnProps {
	accept?: string;
	name?: string;
	selectedFileId: string | undefined;
	setSelectedFileId: (fileId: string | undefined) => void;
	filterByFileTypes?: string[];
	tagsIncluded?: string[];
	excludeIds?: string[];
}

const FileSelectionFieldComponent = ({
	accept,
	name,
	selectedFileId,
	setSelectedFileId,
	filterByFileTypes,
	tagsIncluded,
	excludeIds,
}: OwnProps) => {
	const data = useLazyLoadQuery<FileSelectionField_Query>(
		QUERY,
		{
			fileId: selectedFileId || "",
			skip: !selectedFileId,
			filterByFileTypes,
			tagsIncluded,
		},
		{ fetchPolicy: "network-only" },
	);

	const [selection, setSelection] = useState<any>(data.node);
	const [isModalOpen, setModalOpen] = useState<boolean>(false);

	return (
		<div className="flex">
			<InputText
				onClick={() => {
					setModalOpen(true);
				}}
				className="mr-2 flex-grow-1 w-auto"
				name={name}
				disabled={true}
				value={data.node?.name || "Please select file"}
			/>
			{data.node?.url && (
				<a target="_blank" rel="noopener noreferrer" href={data.node?.url}>
					<Button
						className="w-auto p-button-secondary p-2 mr-2"
						type={"button"}
						disabled={selectedFileId === undefined}
						label={""}
						icon="pi pi-download"
					/>
				</a>
			)}
			<Button
				className="w-auto p-button-secondary p-2"
				type={"button"}
				disabled={selectedFileId === undefined}
				label={""}
				icon="pi pi-times"
				onClick={() => {
					setSelectedFileId(undefined);
				}}
			/>
			<Button
				className="w-auto ml-2"
				type={"button"}
				onClick={() => {
					setModalOpen(true);
				}}
			>
				Select file
			</Button>

			<TkDialog
				header={<h1>{"Select file"}</h1>}
				onHide={() => {
					setModalOpen(false);
				}}
				className="w-8"
				visible={isModalOpen}
			>
				<FilesTable
					accept={accept}
					tagsForUpload={tagsIncluded}
					filesFragmentRef={data}
					excludeIds={excludeIds}
					selectionSettings={{
						selection,
						onSelectionChange: (e) => {
							setSelection(e.value);
							setSelectedFileId(e.value?.id);
							setModalOpen(false);
						},
					}}
				/>
			</TkDialog>
		</div>
	);
};

export const FileSelectionField = (props: OwnProps) => (
	<Suspense fallback={<div>Loading...</div>}>
		<FileSelectionFieldComponent {...props} />
	</Suspense>
);

export const DefaultFileSelectionField = ({
	fieldName,
	fieldValue,
	updateField,
}: ValidatedFieldConfig<string>) => {
	return (
		<FileSelectionField
			name={fieldName}
			selectedFileId={fieldValue}
			setSelectedFileId={updateField}
		/>
	);
};

export const TaggedFileSelectionField =
	(tagsIncluded: string[], accept?: string) =>
	({ fieldName, fieldValue, updateField, excludeIds }: ValidatedFieldConfig<string>) => {
		return (
			<FileSelectionField
				name={fieldName}
				selectedFileId={fieldValue}
				tagsIncluded={tagsIncluded}
				setSelectedFileId={updateField}
				accept={accept}
				excludeIds={excludeIds}
			/>
		);
	};
