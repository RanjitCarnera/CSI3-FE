import { Button } from "primereact/button";
import styled from "styled-components";

export const TkButtonLinkStyles = ` padding: 4px 12px;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  font-family: 'Noto Sans', sans-serif;
  background-color: transparent;
  color: var(--primary-color);
  border: 0;


  font-weight: 500;
  line-height: 1.75;
  border-radius: 34px;

  &:enabled:hover {
    background-color: var(--background-color);
    color: var(--primary-color)
  }`;
export const TkButtonLink = styled(Button)`
	${TkButtonLinkStyles}
`;
export const TkButtonErrorStyles = TkButtonLinkStyles.concat(`
		color: var(--danger);
	&:enabled:hover {
		background-color: rgba(255,21,0,0.1);
		color: var(--danger);
	}
`);
