import styled from "styled-components";
import {DataTable} from "primereact/datatable";


export const TkDataTable = styled(DataTable)`

  .p-column-title {
    font-family: 'Noto Sans', sans-serif;
    font-size: 0.8rem;
    color: var(--dark-2)
  }

  th {
    background-color: transparent !important;
    border: 0 !important;
  }

  td {
    border: 0 !important;
  }

  tr.p-highlight {
    background: rgb(245, 248, 255) !important;
  }
`
