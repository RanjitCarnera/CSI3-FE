import React from "react";

/**
 * Stops Click Event Propagation.
 * Useful for actions column within tables that have selectable rows
 * @param {Component}
 */
export const withoutEventPropagation = (Component: React.ReactNode) => {
	const handleOnClick = (e: React.MouseEvent) => e.stopPropagation();
	return <div onClick={handleOnClick}>{Component}</div>;
};

export const tableUtils = { withoutEventPropagation };
