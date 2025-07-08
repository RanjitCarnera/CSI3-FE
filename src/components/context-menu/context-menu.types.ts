import { type InputVariant } from "@thekeytechnology/framework-react-components";
import { type ButtonContent } from "@thekeytechnology/framework-react-components/dist/components/forms";
import type React from "react";
import { type ReactNode } from "react";

export enum ContextMenuKind {
	"normal" = "normal",
	"override" = "override",
}

type OverrideWithNever<T> = {
	[K in keyof T]: never | undefined;
};

export interface ContextMenuOptionNormal extends ButtonContent {
	onClick: () => void;
	kind: ContextMenuKind.normal;
	node?: never;
	inputVariant?: InputVariant;
}

export interface ContextMenuOptionOverride extends OverrideWithNever<ButtonContent> {
	kind: ContextMenuKind.override;
	onClick?: never;
	node: ReactNode;
	inputVariant?: never;
}

export type ContextMenuOption = ContextMenuOptionNormal | ContextMenuOptionOverride;

export interface ContextMenuProps {
	options: ContextMenuOption[];
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
