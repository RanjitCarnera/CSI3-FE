export interface CreateUserInAccountModalProps {
	connectionId?: string;
	accountId: string;
	onCompleted?: () => void;

	isVisible: boolean;
	onHide: () => void;
}
