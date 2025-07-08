import styled from "styled-components";
import { NavLink as RRDNavLink } from "react-router-dom";
import { primary } from "@screens/skill-assessment/parts/mock/color";

export const NavLink = styled(RRDNavLink)`
	color: ${primary.rgbaValue()};
`;
