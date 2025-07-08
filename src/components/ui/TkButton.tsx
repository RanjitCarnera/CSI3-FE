import { Button } from "primereact/button";
import styled from "styled-components";

export const TkButtonStyles = `
	padding: 4px 12px;
	//min-width: 64px;
	
	
	transition:
		background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
		box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
		border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

	font-family: "Noto Sans", sans-serif;
	background-color: var(--primary-color);
	color: white !important;
	border: 0;
	font-size: 0.9rem;

	font-weight: 500;
	line-height: 1.75;
	border-radius: 34px;

	&:enabled:hover {
		background-color: var(--primary-color-darker);
		color: white;
	}`;
export const TkButton = styled(Button)`
	${TkButtonStyles}
`;
