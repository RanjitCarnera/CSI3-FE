export type DraggableProps = {
	onMove: (dragIndex: number, hoverIndex: number) => void;
	onDelete: (id: string) => void;
	index: number;
	id: string;
	text: string;
	isCategoryItem?: boolean;
};
