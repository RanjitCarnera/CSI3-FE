import styled from "styled-components";
import {Card} from "primereact/card";


export const NoContentPaddingCard = styled(Card)`
  .p-card-content {
    padding: 0;
  }

`

export const NoContentAndBodyPaddingCard = styled(Card)`
  .p-card-content {
    padding: 0;
  }

  .p-card-body {
    padding: 0;
  }
`
