import { HTMLAttributes } from "react";

export interface FilterTagProps extends HTMLAttributes<HTMLDivElement> {
	/**
	 * Text above, detailing which filter to use.
	 */
	header: string;
	/**
	 * Filter value ie. "fooBar" or "5 selected" or "By Name - Ascending"
	 */
	value: string;
	/**
	 * icon to show on the right
	 * ie "pi pi-clear"
	 */
	icon?: string;
	/**
	 * tooltip to be displayed
	 */
	tooltip?: string;
}
