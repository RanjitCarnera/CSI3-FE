import { classNames } from "primereact/utils";
import { useDrag } from "react-dnd";
import { useFragment } from "react-relay";
import { PersonCard } from "@components/person-card";
import {
	PERSON_FRAGMENT,
	SCENARIO_FRAGMENT,
} from "@components/person-card/parts/person-card-draggable/person-card-draggable.graphql";
import {
	type DragProps,
	type PersonCardDraggableProps,
	type PersonDragItem,
} from "@components/person-card/parts/person-card-draggable/person-card-draggable.types";
import { type personCardDraggable_PersonFragment$key } from "@relay/personCardDraggable_PersonFragment.graphql";
import { type personCardDraggable_ScenarioFragment$key } from "@relay/personCardDraggable_ScenarioFragment.graphql";

export const DraggablePersonCard = ({
	personFragmentRef,
	scenarioFragmentRef,
	hideTotalVolume,
	children,
}: PersonCardDraggableProps) => {
	const scenario = useFragment<personCardDraggable_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragmentRef,
	);
	const person = useFragment<personCardDraggable_PersonFragment$key>(
		PERSON_FRAGMENT,
		personFragmentRef,
	);

	const [{ isDragging }, drag, dragPreview] = useDrag<PersonDragItem, {}, DragProps>(() => ({
		// "type" is required. It is used by the "accept" specification of drop targets.
		type: "Person",
		item: { id: person.id, assignmentRoleId: person.assignmentRole?.id },
		// The collect function utilizes a "monitor" instance (see the Overview for what this is)
		// to pull important pieces of state from the DnD system.
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));

	return (
		<PersonCard
			scenarioFragmentRef={scenario}
			personFragmentRef={person}
			hideTotalVolume={hideTotalVolume}
			scenarioUtilizationRef={scenario.utilization}
			ref={
				{
					outerRef: dragPreview,
					innerRef: drag,
				} as any
			}
			className={classNames("hover:border-900 cursor-pointer", {
				dragging: isDragging,
			})}
		>
			{children}
		</PersonCard>
	);
};
