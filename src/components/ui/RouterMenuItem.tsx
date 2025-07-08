import {useMatch, useNavigate} from "react-router-dom";
import {MenuItem} from "primereact/menuitem";
import styled from "styled-components";
import {classNames} from "primereact/utils";

interface OwnProps {
    item: MenuItem,
    collapsed?: boolean
}

export const RouterMenuItem = ({item, collapsed}: OwnProps) => {
    const match = useMatch({path: item.url!, end: true})
    const navigate = useNavigate();
    return <StyledItem
        onClick={() => {
            navigate(item.url!, {state: {label: item.label}})
        }}
        className={"cursor-pointer justify-content-center border-round font-bold flex align-items-center " + (match ? "active" : "")}>
        {item.icon && <span className={`flex align-items-center ${classNames({"mr-3": !collapsed})}`}> <i
            className={"text-lg " + item.icon}/></span>}
        {!collapsed && <span className="text-sm">{item?.label}</span>}
    </StyledItem>
}

const StyledItem = styled.div`
  margin-bottom: 2em;

  border: none;

  padding: 4px 12px;
  min-width: 64px;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  font-family: 'Noto Sans', sans-serif;
  background-color: var(--primary-color);
  color: white;
  border: 0;
  font-size: 0.9rem;


  font-weight: 500;
  line-height: 1.75;
  border-radius: 34px !important;

  &:hover, &.active {
    background-color: var(--primary-color-darker) !important;
    color: white;
  }

  @media screen and (min-width: 768px) {
    color: white;
    text-align: center;

    :hover {
      cursor: pointer;
      background-color: #2fdbb112
    }

    &.active {
      background-color: #2fdbb112
    }
  }


`

