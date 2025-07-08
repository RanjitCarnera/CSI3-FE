import { Button } from "@thekeytechnology/framework-react-components";
import { Tag } from "primereact/tag";
import React, { Fragment, useMemo } from "react";
import { ContextMenu } from "@components/context-menu";
import { ContextMenuKind } from "@components/context-menu/context-menu.types";
import {
	Item,
	MainItem,
	MainItemRow,
	Wrapper,
} from "@screens/personal-data/parts/2fa-form/parts/slot/slot.styles";
import {
	type SlotAction,
	type SlotProps,
} from "@screens/personal-data/parts/2fa-form/parts/slot/slot.types";

export const Slot = ({ badges, icon, title, actions, subtitle }: SlotProps) => {
	const Icon = icon ? (
		<Item>
			<i className={icon} />
		</Item>
	) : (
		<Fragment />
	);
	const Badges = badges.map((badge) => (
		<Tag key={badge.label} severity={badge.severity}>
			{badge.label}
		</Tag>
	));
	const Action = useMemo(() => getAction(actions), [actions]);
	return (
		<Wrapper>
			{Icon}
			<MainItem>
				<MainItemRow>
					<h3>{title}</h3>
					{Badges}
				</MainItemRow>
				<MainItemRow>
					<div>{subtitle}</div>
				</MainItemRow>
			</MainItem>
			<Item>{Action}</Item>
		</Wrapper>
	);
};

function getAction(actions: SlotAction[]): React.ReactNode {
	if (!actions.length) return <div></div>;
	if (actions.length === 1)
		return actions.map((action) => (
			<Button
				key={action.label}
				content={{ label: action.label }}
				onClick={action.onClick}
				tooltip={{ content: action.tooltip }}
				inputVariant={"subtle"}
				disabled={action.isDisabled}
			/>
		));
	return (
		<ContextMenu
			options={actions.map((action) => ({
				label: action.label,
				onClick: action.onClick,
				kind: ContextMenuKind.normal,
				inputVariant: action.severity,
			}))}
		/>
	);
}
