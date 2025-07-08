import styled from "styled-components";
import {Card} from "primereact/card";

export const TkCard = styled(Card)`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.15);
  border-radius: 8px;

  .p-card-content {
    padding: 0;
  }

  &.card-flat {
    box-shadow: none !important;
  }
`
