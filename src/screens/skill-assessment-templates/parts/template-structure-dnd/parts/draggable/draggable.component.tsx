import React, { useRef } from "react";
import { DraggableProps } from "./draggable.types";
import {
	DeleteWrapper,
	IconWrapper,
	TextWrapper,
	Wrapper,
} from "@screens/skill-assessment-templates/parts/template-structure-dnd/parts/draggable/draggable.styles";
import { useDrag, useDrop } from "react-dnd";
import { Identifier, XYCoord } from "dnd-core";
import { ItemTypes } from "@screens/skill-assessment-templates/parts/template-structure-dnd/parts/draggable/draggable.consts";

type DragItem = {
	index: number;
	id: string;
	type: string;
};

export const Draggable = ({
	onMove,
	text,
	index,
	onDelete,
	id,
	isCategoryItem,
	...props
}: DraggableProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
		accept: ItemTypes.DRAGGABLE,
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			};
		},
		hover(item: DragItem, monitor) {
			if (!ref.current) {
				return;
			}
			const dragIndex = item.index;
			const hoverIndex = index;

			// Don't replace items with themselves
			if (dragIndex === hoverIndex) {
				return;
			}

			// Determine rectangle on screen
			const hoverBoundingRect = ref.current?.getBoundingClientRect();

			// Get vertical middle
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

			// Determine mouse position
			const clientOffset = monitor.getClientOffset();

			// Get pixels to the top
			const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%

			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}

			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}

			// Time to actually perform the action
			onMove(dragIndex, hoverIndex);

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			item.index = hoverIndex;
		},
	});

	const [{ isDragging }, drag] = useDrag({
		type: ItemTypes.DRAGGABLE,
		item: () => {
			return { id, index };
		},
		collect: (monitor: any) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const opacity = isDragging ? 0 : 1;
	drag(drop(ref));

	const handleDeleteOnClick = () => {
		onDelete(id);
	};

	return (
		<Wrapper
			ref={ref}
			style={{ opacity }}
			data-handler-id={handlerId}
			isCategoryItem={isCategoryItem}
		>
			<IconWrapper className={"pi pi-bars"}></IconWrapper>
			<TextWrapper>{text}</TextWrapper>
			<DeleteWrapper onClick={handleDeleteOnClick} className={"pi pi-times"}></DeleteWrapper>
		</Wrapper>
	);
};
