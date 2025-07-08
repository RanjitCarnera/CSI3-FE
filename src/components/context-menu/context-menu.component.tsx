import { Button } from "@thekeytechnology/framework-react-components";
import { OverlayPanel } from "primereact/overlaypanel";
import React, {
	cloneElement,
	forwardRef,
	Fragment,
	type ReactElement,
	useImperativeHandle,
	useRef,
} from "react";
import { match } from "ts-pattern";
import { Wrapper } from "@components/context-menu/context-menu.styles";
import {
	ContextMenuKind,
	type ContextMenuProps,
} from "@components/context-menu/context-menu.types";

export const ContextMenu = forwardRef<{ hide: () => void }, ContextMenuProps>(
	({ onClick, options }, ref) => {
		const overlayRef = useRef<OverlayPanel>(null);
		const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
			if (onClick) {
				onClick(e);
			}
			overlayRef.current?.toggle(e);
		};
		const handleClose = () => {
			overlayRef.current?.hide();
		};

		useImperativeHandle(ref, () => ({
			hide: () => {
				handleClose();
			},
		}));
		return (
			<>
				<Button
					inputVariant={"subtle"}
					content={{ icon: "pi pi-ellipsis-h" }}
					onClick={(e) => {
						handleClick(e);
					}}
				/>
				<OverlayPanel ref={overlayRef}>
					<Wrapper>
						{options.map(
							(
								{ label, icon, iconPosition, onClick, kind, node, inputVariant },
								index,
							) =>
								match(kind)
									.with(ContextMenuKind.normal, () => (
										<Button
											content={{
												icon,
												label,
												iconPosition,
											}}
											key={"item" + index}
											onClick={() => {
												onClick?.();
												handleClose();
											}}
											inputVariant={inputVariant ?? "subtle"}
										/>
									))
									.with(ContextMenuKind.override, () =>
										cloneElement(node as ReactElement, {
											key: "item" + index,
											onClick: () => {
												(node as ReactElement).props.onClick?.();
												handleClose();
											},
										}),
									)
									.otherwise(() => <Fragment />),
						)}
					</Wrapper>
				</OverlayPanel>
			</>
		);
	},
);
