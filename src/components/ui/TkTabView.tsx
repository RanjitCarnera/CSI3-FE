import styled from "styled-components";
import {TabView} from "primereact/tabview";

export const TkTabView = styled(TabView)`
  .p-tabview-title {
    font-weight: normal;
  }


  li {
    border-color: #214CE2;

    border-bottom: 1px solid var(--primary-color);
    border-bottom-color: rgb(33, 76, 226);

    &.p-highlight a {
      color: var(--primary-color) !important;
    }
  }

  li a {
    border-radius: 8px 8px 0 0 !important;
  }

  .p-tabview-nav {
    border: 0;

  }
`
