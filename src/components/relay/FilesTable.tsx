import graphql from "babel-plugin-relay/macro";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, type DataTableSelectionSingleChangeEvent } from "primereact/datatable";
import { type FileUploadErrorEvent } from "primereact/fileupload";
import { useMutation, usePaginationFragment } from "react-relay";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "@i18n/ERROR_MESSAGES";
import { type FilesTable_DeleteMutation } from "@relay/FilesTable_DeleteMutation.graphql";
import { type FilesTable_FilesListFragment$key } from "@relay/FilesTable_FilesListFragment.graphql";
import { type FilesTable_Refetch } from "@relay/FilesTable_Refetch.graphql";
import { DateTimeDisplay } from "../ui/DateTimeDisplay";
import { TkFileUpload } from "../ui/TkFileUpload";
import { useDialogLogic } from "../ui/useDialogLogic";

const FILES_FRAGMENT = graphql`
	fragment FilesTable_FilesListFragment on Query
	@refetchable(queryName: "FilesTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 20 }
		after: { type: "String" }
		filterByName: { type: "String" }
		filterByFileTypes: { type: "[String!]" }
		filterByFromDateTimeInclusive: { type: "ZonedDateTIme" }
		filterByToDateTimeInclusive: { type: "ZonedDateTIme" }
		tagsIncluded: { type: "[String!]" }
	) {
		Admin {
			Files {
				Files(
					first: $first
					after: $after
					name: $filterByName
					fileType: $filterByFileTypes
					fromDateTimeInclusive: $filterByFromDateTimeInclusive
					toDateTimeInclusive: $filterByToDateTimeInclusive
					tagsIncluded: $tagsIncluded
				) @connection(key: "FilesTable_Files") {
					__id
					pageInfo {
						endCursor
						hasPreviousPage
						hasNextPage
						startCursor
					}
					edges {
						node {
							id
							name
							fileType
							accessType
							uploadDateTime
							thumbnail
							url
						}
					}
				}
			}
		}
	}
`;

const DELETE_MUTATION = graphql`
	mutation FilesTable_DeleteMutation($input: DeleteFileInput!, $connections: [ID!]!) {
		Admin {
			Files {
				deleteFile(input: $input) {
					deletedIds @deleteEdge(connections: $connections)
				}
			}
		}
	}
`;

interface SelectionSettings {
	selection: any;
	onSelectionChange: (selection: DataTableSelectionSingleChangeEvent<any>) => void;
}

interface OwnProps {
	tagsForUpload?: string[];
	accept?: string;
	filesFragmentRef: FilesTable_FilesListFragment$key;
	selectionSettings?: SelectionSettings;
	excludeIds?: string[];
}

export const FilesTable = ({
	filesFragmentRef,
	tagsForUpload,
	accept,
	selectionSettings,
	excludeIds,
}: OwnProps) => {
	const {
		data: {
			Admin: {
				Files: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					Files: { __id, edges: files },
				},
			},
		},
		hasNext,
		loadNext,
		refetch,
	} = usePaginationFragment<FilesTable_Refetch, FilesTable_FilesListFragment$key>(
		FILES_FRAGMENT,
		filesFragmentRef,
	);

	const [deleteBrand, isDeleting] = useMutation<FilesTable_DeleteMutation>(DELETE_MUTATION);

	const { showDialog, dialogComponent } = useDialogLogic();

	const filteredFiles = files?.filter((f) =>
		excludeIds ? !excludeIds.includes(f?.node.id ?? "") : true,
	);

	return (
		<>
			{dialogComponent}

			<TkFileUpload
				tagsForUpload={tagsForUpload}
				accept={accept}
				className="mb-3"
				url={`${process.env.REACT_APP_API_BASE}/api/upload`}
				onUpload={() => refetch({}, { fetchPolicy: "network-only" })}
				onError={(e: FileUploadErrorEvent) =>
					toast.error(ERROR_MESSAGES[e.xhr.response] || e.xhr.response)
				}
			/>

			<DataTable
				emptyMessage={"No files."}
				className="mb-3"
				value={filteredFiles?.map((b) => b!.node!) as any[]}
				onSelectionChange={
					selectionSettings ? selectionSettings.onSelectionChange : undefined
				}
				selection={selectionSettings ? selectionSettings.selection : undefined}
				selectionMode={selectionSettings ? "single" : undefined}
			>
				<Column selectionMode="single" style={{ width: "3em" }} />
				<Column header="Name" field="name" />
				<Column
					header="Access"
					body={(row) => <p>{row.accessType === "signedUrl" ? "private" : "public"}</p>}
				/>
				<Column header="Type" field="fileType" />
				<Column
					header="Uploaded at"
					body={(row) => <DateTimeDisplay value={row.uploadDateTime} />}
				/>
				<Column
					header="Actions"
					style={{ width: "20%" }}
					body={(item) => (
						<Button
							disabled={isDeleting}
							type="button"
							onClick={() => {
								showDialog({
									title: "Delete file",
									content:
										"Do you really want to delete this file? This cannot be undone.",
									dialogCallback: (result) => {
										if (result === "Accept") {
											deleteBrand({
												variables: {
													input: {
														ids: [item.id],
													},
													connections: [__id],
												},
											});
										}
									},
								});
							}}
							icon={"pi pi-trash"}
						/>
					)}
				/>
			</DataTable>

			{hasNext && (
				<div className="flex justify-content-center align-items-center">
					<Button
						type="button"
						className="p-button-secondary"
						onClick={() => loadNext(20)}
					>
						Load more
					</Button>
				</div>
			)}
		</>
	);
};
