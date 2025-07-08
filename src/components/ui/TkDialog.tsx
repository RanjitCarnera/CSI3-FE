import styled from "styled-components";
import {Dialog} from "primereact/dialog";

export const TkDialog = styled(Dialog)`
  min-width: 512px;

  .p-dialog-content {
    border-top-left-radius: ${props => !props.header ? "8px" : "0"};
    border-top-right-radius: ${props => !props.header ? "8px" : "0"};

    border-bottom-left-radius: ${props => !props.footer ? "8px" : "0"};
    border-bottom-right-radius: ${props => !props.footer ? "8px" : "0"};
  }

  .p-dialog-footer {
    border-bottom-left-radius: ${props => props.footer ? "8px" : "0"};
    border-bottom-right-radius: ${props => props.footer ? "8px" : "0"};
  }


  .p-dialog-header {
    border-top-left-radius: ${props => props.header ? "8px" : "0"};
    border-top-right-radius: ${props => props.header ? "8px" : "0"};

    h1 {
      margin: 0;
      text-align: center;
      color: var(--dark);
      font-size: 1rem;
    }
  }
`
