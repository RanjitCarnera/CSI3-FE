import {SelectButton} from "primereact/selectbutton";
import styled from "styled-components";


export const TkSelectButton = styled(SelectButton)`
  border: 1px solid #EFF1FB;
  border-radius: 35px;
  overflow: hidden;
  background-color: white;
  padding: 5px;

  .p-button {
    border-radius: 50px !important;
    height: 35px;
    padding: 5px;
    border: 0;
    color: var(--dark-2) !important;

    &:hover {
      background-color: transparent !important;
    }

    &:not(:last-of-type) {
      margin-right: 10px;
    }

    &.p-highlight {
      background-color: transparent;
      color: inherit;
      box-shadow: 0 0 7px rgb(202 200 200 / 32%);
    }
  }
`
