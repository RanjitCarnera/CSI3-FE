import {
	DEFAULT_COMPONENTS_STYLING,
	DefaultIconFactory,
	DefaultStyledDialogComponents,
	DefaultStyledInputTextComponents,
	DefaultStyledTooltipComponents,
	type IconFactory,
	type TkComponentStyles,
} from "@thekeytechnology/framework-react-components";
import { Button } from "primereact/button";
import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { match } from "ts-pattern";
import tw from "twin.macro";
import { TkButtonStyles } from "@components/ui/TkButton";
import { TkButtonErrorStyles, TkButtonLinkStyles } from "@components/ui/TkButtonLink";
import { TOOLTIP_ZINDEX } from "@corestyle/component-theme/component-theme.const";
import { HorizontalElementSpacingWrapper } from "@corestyle/component-theme/default-spacings.component";
import {
	borderColor,
	negative,
	primary,
	textContrast,
	textExtraSubtle,
	white,
} from "@screens/skill-assessment/parts/mock/color";
import {
	buttonTypography,
	inputTypography,
	labelTypography,
	pageTitleTypography,
	tooltipTypography,
} from "@screens/skill-assessment/parts/mock/typography";
import { ReactComponent as Check } from "../../assets/icons/check.svg";
import { ReactComponent as Download } from "../../assets/icons/download.svg";
import { ReactComponent as Filter } from "../../assets/icons/filter.svg";
import { ReactComponent as HorizontalMenu } from "../../assets/icons/horizontal-menu.svg";
import { ReactComponent as InformationCircle } from "../../assets/icons/information-circle.svg";
import { ReactComponent as LinkShare } from "../../assets/icons/link-share.svg";

const MyIconFactory: IconFactory = (icon, id, ...rest) => {
	if (icon === "Information-circle") return React.cloneElement(<InformationCircle />, { id });
	else if (icon === "Link-share") return React.cloneElement(<LinkShare />, { id });
	else if (icon === "Filter") return React.cloneElement(<Filter />, { id });
	else if (icon === "Download") return React.cloneElement(<Download />, { id });
	else if (icon === "Horizontal-menu") return React.cloneElement(<HorizontalMenu />, { id });
	else if (icon === "Check") return React.cloneElement(<Check />, { id });
	else if (icon?.includes("pi")) return React.cloneElement(<div className={icon} />, { id });
	else return DefaultIconFactory(icon, id, ...rest);
};
export const HarkinsTheme: TkComponentStyles = {
	...DEFAULT_COMPONENTS_STYLING,
	HorizontalElementSpacingWrapper,
	Dialog: {
		...DefaultStyledDialogComponents.Dialog,
		DialogGlobal: createGlobalStyle``,
		DialogHeader: tw.div``,
	},
	FormDialog: {
		...DEFAULT_COMPONENTS_STYLING.FormDialog,
		FormDialogButtonContainer: styled.div`
			display: flex;
			justify-content: flex-end;
		`,
		SaveText: "Save",
		CancelText: "Cancel",
	},
	DialogLogic: {
		...DEFAULT_COMPONENTS_STYLING.DialogLogic,
		ButtonContainer: styled.div`
			display: flex;
			justify-content: flex-end;
		`,
	},
	Icon: {
		...DEFAULT_COMPONENTS_STYLING.Icon,
		IconFactory: MyIconFactory,
	},
	Tooltip: {
		...DefaultStyledTooltipComponents.Tooltip,
		StyledTooltip: styled(DefaultStyledTooltipComponents.Tooltip.StyledTooltip)<{
			position?: string;
		}>`
			z-index: ${TOOLTIP_ZINDEX} !important;

			.p-tooltip-text {
				background-color: ${textContrast.hexValue()};
				padding: 1.25rem;
				${tooltipTypography.getCSS()};
			}

			.p-tooltip-arrow {
				border-right-color: ${textContrast.hexValue()};
				${(p) => {
					if (!p.position || p.position === "right") {
						return `border-right-color: ${textContrast.hexValue()};`;
					}
					if (p.position === "bottom") {
						return `border-bottom-color: ${textContrast.hexValue()};`;
					}
					return "";
				}}

		`,
	},
	Button: {
		...DEFAULT_COMPONENTS_STYLING.Button,
		StyledButton: styled(DEFAULT_COMPONENTS_STYLING.Button.StyledButton)`
			div.pi {
				${(p) => {
					return match(p.iconPos)
						.with("left", () => "padding-right: 0.5rem;")
						.with("right", () => "padding-left: 0.5rem;")
						.with("top", () => "")
						.with("bottom", () => "")
						.otherwise(() => "");
				}}
			}

			&[inputvariant="subtle"] {
				${TkButtonLinkStyles}
			}

			&[inputvariant="solid"] {
				${TkButtonStyles}
			}

			&[inputvariant="error"] {
				${TkButtonErrorStyles}
			}

			display: flex;
			${(p) => (p.icon && p.label ? "gap: 0.25rem;" : "")}
			align-items: center;
			justify-content: center;
		`,
	},
	DeleteButton: {
		...DEFAULT_COMPONENTS_STYLING.DeleteButton,
		Content: (selectedIdsLength, singularName, pluralName) => {
			return `Are you sure you want to delete ${selectedIdsLength} ${
				selectedIdsLength > 1 ? pluralName : singularName
			}? This action is not reversible.`;
		},
		Title: (selectedIdsLength, singularName, pluralName) => {
			return `Delete ${selectedIdsLength > 1 ? pluralName : singularName}`;
		},
	},
	Form: {
		...DEFAULT_COMPONENTS_STYLING.Form,
		StyledForm: styled(DEFAULT_COMPONENTS_STYLING.Form.StyledForm).attrs({
			className: "p-fluid",
		})`
			${tw`flex flex-col gap-2 max-w-[95vw]`}
		`,
	},
};

export const SkillAssessmentTheme: TkComponentStyles = {
	...DEFAULT_COMPONENTS_STYLING,
	HorizontalElementSpacingWrapper,
	Dialog: {
		...DefaultStyledDialogComponents.Dialog,
		DialogGlobal: createGlobalStyle`
			.p-dialog {
				min-width: 32.5rem;
			}
			
			.p-dialog-header {
				border-top-left-radius: 1rem;
				border-top-right-radius: 1rem;
				padding: 0rem 2rem;
				padding-top: 2.5rem;
				padding-bottom: 2rem;

				& > div > div {
					${pageTitleTypography.getCSS()};
				}
			}

			.p-dialog-content {
				padding: 0rem 2rem;
				padding-bottom: 2rem;

			}

			.p-dialog-footer {
				border-bottom-left-radius: 1rem;
				border-bottom-right-radius: 1rem;
				padding: 1.5rem 2.5rem;
				border-top: 2px solid ${borderColor.hexValue()};
				box-shadow: 0px -6px 12px 0px rgba(161, 171, 187, 0.10);
			}
		`,
		DialogHeader: tw.div``,
	},
	FormDialog: {
		...DEFAULT_COMPONENTS_STYLING.FormDialog,
		FormDialogButtonContainer: styled.div`
			display: flex;
			justify-content: flex-end;
		`,
		SaveText: "Save",
		CancelText: "Cancel",
	},
	DialogLogic: {
		...DEFAULT_COMPONENTS_STYLING.DialogLogic,
		ButtonContainer: styled.div`
			display: flex;
			justify-content: flex-end;
		`,
	},

	InputText: {
		...DEFAULT_COMPONENTS_STYLING.InputText,
		StyledInputText: styled(DefaultStyledInputTextComponents.InputText.StyledInputText)`
			flex: 1;
			border: none;
			padding: 0;
			// todo only if icon

			${inputTypography.getCSS()};
			${(p) =>
				p.hasIcon
					? `&:focus-within {
				border: none;
				box-shadow: none;
			}`
					: ""}
		}

		;
		`,
		TextWrapper: styled(DefaultStyledInputTextComponents.InputText.TextWrapper)`
			display: flex;
			flex-direction: row-reverse;
			align-items: center;
			gap: 1rem;

			border: 2px solid ${borderColor.hexValue()};
			border-radius: 0.5rem;
			background: ${white.hexValue()};
			transition: box-shadow 0.3s ease-in-out;

			// todo only for inputVariant === lg
			padding: 1rem 0rem;

			//todo only if icon
			padding-left: 1.25rem;

			&:focus-within {
				box-shadow: 0 0 0 0.2rem ${primary.hexValue()};
			}
		`,
	},
	Button: {
		...DEFAULT_COMPONENTS_STYLING.Button,
		StyledButton: styled(Button as any)`
			border-radius: 2rem;
			height: 3.5rem;
			padding: 0rem 2.5rem 0.125rem 2.5rem;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 1rem;
			align-self: stretch;
			background-color: ${primary.toString()};
			color: ${white.hexValue()};
			width: 100%; // TODO
			${buttonTypography.getCSS()};

			&:disabled {
				background-color: ${borderColor.toString()};
				border: none;
				color: ${textExtraSubtle.hexValue()};
			}

			&[inputvariant="subtle"] {
				background-color: ${primary.withAlpha(0.05).rgbaValue()};
				color: ${primary.hexValue()};
				border: none;
			}

			&[inputvariant="error"] {
				background-color: ${negative.rgbaValue()};
				color: ${white.hexValue()};
				border: none;
			}
		` as any,
	},
	Field: {
		...DEFAULT_COMPONENTS_STYLING.Field,
		FieldContainer: styled.div`
			.p-dropdown,
			.p-multiselect {
				display: flex;
			}
		`,
		StyledLabel: styled.div`
			${labelTypography.getCSS()};
			margin-bottom: 0.5rem;
		`,
		ErrorWrapper: styled.div`
			color: red;
		`,
	},
	Icon: {
		...DEFAULT_COMPONENTS_STYLING.Icon,
		IconFactory: MyIconFactory,
	},
	Tooltip: {
		...DefaultStyledTooltipComponents.Tooltip,
		StyledTooltip: styled(DefaultStyledTooltipComponents.Tooltip.StyledTooltip)<{
			position?: string;
		}>`

			.p-tooltip-text {
				background-color: ${textContrast.hexValue()};
				padding: 1.25rem;
				${tooltipTypography.getCSS()};
			}

			.p-tooltip-arrow {
				border-right-color: ${textContrast.hexValue()};
				${(p) => {
					if (!p.position || p.position === "right") {
						return `border-right-color: ${textContrast.hexValue()};`;
					}
					if (p.position === "bottom") {
						return `border-bottom-color: ${textContrast.hexValue()};`;
					}
					return "";
				}}

		`,
	},
};
