export interface SyncRandProjectsButtonProps {
	projectIds: string[];
	onCompleted: () => void;
}

export interface SyncIssue {
	id: string;
	issue: string;
}
export interface SyncResult {
	editedEntities: number;
	issues: SyncIssue[];
}
