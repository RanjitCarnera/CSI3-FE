import styled from "styled-components";

export const FilterTagFlex = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;
export const FilterTagWrapper = styled.div<{ onClick?: unknown }>`
	box-sizing: border-box;
	outline: 1px solid var(--primary-color);
	background-color: var(--background-color);
	color: var(--primary-color);
	font-family: "Noto Sans", sans-serif;
	font-weight: 500;
	display: flex;
	align-items: center;
	gap: 0.5rem;

	height: min-content;
	padding: 4px 12px;
	border-radius: 34px;
	cursor: pointer;
	transition: 0.1s ease-out all;

	&:hover {
		background-color: white;
		color: var(--primary-color-darker);
		outline-color: var(--primary-color-darker);
	}
`;
