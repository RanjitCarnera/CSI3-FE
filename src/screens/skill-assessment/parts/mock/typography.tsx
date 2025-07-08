import React from "react";
import { Color, Typography } from "@thekeytechnology/framework-react-components";
import styled, { css } from "styled-components";
import { textSubtle } from "@screens/skill-assessment/parts/mock/color";

const baseTypography = new Typography(css`
	font-family: Noto Sans;
`);
const pTypography = new Typography(css`
	${baseTypography.getCSS()};
	line-height: 170%;
	font-size: 0.875rem;
	font-weight: 400;
`);
export const PSpan = styled.span<{ color: Color }>`
	${pTypography.getCSS()};
	${(p) => `color: ${p.color.hexValue()};`}
`;

export const pageTitleTypography = new Typography(css`
	${baseTypography.getCSS()};
	font-size: 2.5rem;
	font-weight: 400;
	line-height: 125%;
	font-family: Noto Serif;
`);
export const PageTitleSpan = styled.span<{ color: Color }>`
	${pageTitleTypography.getCSS()};
	${(p) => `color: ${p.color.hexValue()};`}
`;

export const labelTypography = new Typography(css`
	${baseTypography.getCSS()};
	font-size: 0.875rem;
	font-weight: 700;
	line-height: 170%;
	text-transform: uppercase;
`);
export const LabelSpan = styled.span<{ color: Color }>`
	${labelTypography.getCSS()};
	${(p) => `color: ${p.color.hexValue()};`}
`;

const tbdTypography = new Typography(css`
	${baseTypography.getCSS()};
	font-size: 0.875rem;
	font-weight: 500;
	line-height: 100%;
`);
export const TbdSpan = styled.span<{ color: Color }>`
	${tbdTypography.getCSS()};
	${(p) => `color: ${p.color.hexValue()};`}
`;

export const headerBoldTypography = new Typography(css`
	${baseTypography.getCSS()};

	font-size: 1.375rem;
	font-weight: 700;
	line-height: 125%;
	letter-spacing: -0.0275rem;
`);
export const HeaderBoldSpan = styled.span<{ color: Color }>`
	${headerBoldTypography.getCSS()};
	${(p) => `color: ${p.color.hexValue()};`}
`;
export const headerTypography = new Typography(css`
	${baseTypography.getCSS()};

	font-family: Noto Serif;
	font-size: 1.375rem;
	font-style: normal;
	font-weight: 500;
	line-height: 125%;
	letter-spacing: -0.0275rem;
`);
export const HeaderSpan = styled.span<{ color: Color }>`
	${headerTypography.getCSS()};
	${(p) => `color: ${p.color.hexValue()};`}
`;

export const dropdownValueTypography = new Typography(css`
	font-size: 1.125rem;
	font-style: normal;
	font-weight: 500;
	line-height: 150%;
`);
export const dropdownOptionTypography = new Typography(css`
	font-size: 0.875rem;
	font-style: normal;
	font-weight: 500;
	line-height: 230%;
`);
export const dropdownOptionMatchTypography = new Typography(css`
	${dropdownOptionTypography.getCSS()};
	font-weight: 800;
`);

export const inputButtonTypography = new Typography(css`
	${baseTypography.getCSS()};
	font-size: 1.125rem;
	font-weight: 700;
	line-height: 100%;
`);
export const InputButtonTypography = styled.span<{ color: Color }>`
	${inputButtonTypography.getCSS()};
	${(p) => `color: ${p.color.hexValue()};`}
`;

export const tooltipTypography = new Typography(css`
	${baseTypography.getCSS()};

	font-size: 0.875rem;
	font-weight: 500;
	line-height: 150%;
`);

export const buttonSmTypography = new Typography(css`
	${baseTypography.getCSS()}
	color: #0169F8;
	/* button - sm */
	font-family: Noto Sans;
	font-size: 0.875rem;
	font-style: normal;
	font-weight: 600;
	line-height: 170%; /* 1.4875rem */
`);
export const ButtonSmSpan = styled.span`
	${buttonSmTypography.getCSS()}
`;

export const buttonTypography = new Typography(css`
	${baseTypography.getCSS()}
	font-size: 1.125rem;
	font-weight: 600;
	line-height: 100%;
`);

export const inputTypography = new Typography(css`
	${baseTypography.getCSS()};

	font-size: 1.125rem;
	font-style: normal;
	font-weight: 500;
	line-height: 100%;
	color: ${textSubtle.hexValue()};
`);

export const primaryDataTableTypography = new Typography(css`
	${baseTypography.getCSS()};
	font-size: 0.875rem;
	font-weight: 600;
	line-height: 340%;
`);
export const PrimaryDataTableSpan = styled.span<{ color: Color }>`
	${primaryDataTableTypography.getCSS()}
	${(p) => `color: ${p.color.hexValue()};`}
`;

export const secondaryDataTableTypography = new Typography(css`
	${baseTypography.getCSS()};
	font-size: 0.875rem;
	font-weight: 500;
	line-height: 340%;
`);
export const SecondaryDataTableSpan = styled.span<{ color: Color }>`
	${secondaryDataTableTypography.getCSS()}
	${(p) => `color: ${p.color.hexValue()};`}
`;

export const playerCardHeaderTypography = new Typography(css`
	${baseTypography.getCSS()};
	font-family: Noto Sans;
	font-size: 1.44375rem;
	font-style: normal;
	font-weight: 700;
	line-height: 125%; /* 1.80469rem */
	letter-spacing: -0.02888rem;
`);
export const PlayerCardHeaderH3 = styled.h3<{ color: Color }>`
	${playerCardHeaderTypography.getCSS()}
	${(p) => `color: ${p.color.hexValue()};`}
`;

export const personDetailsModalTypography = new Typography(css`
	${baseTypography.getCSS()};
	font-family: Noto Sans;
	font-size: 1.375rem;
	font-style: normal;
	font-weight: 700;
	line-height: 100%;
`);
export const PersonDetailsModalSpan = styled.span<{ color: Color }>`
	${personDetailsModalTypography.getCSS()}
	${(p) => `color: ${p.color.hexValue()};`}
`;

export const personDetailsModalDimensionCountTypography = new Typography(css`
	${baseTypography.getCSS()};
	font-family: Noto Sans;
	font-size: 0.6875rem;
	font-style: normal;
	font-weight: 400;
	line-height: 125%; /* 0.85938rem */
`);
export const PersonDetailsModalDimensionCountTypographySpan = styled.span<{ color: Color }>`
	${personDetailsModalDimensionCountTypography.getCSS()}
	${(p) => `color: ${p.color.hexValue()};`}
`;
