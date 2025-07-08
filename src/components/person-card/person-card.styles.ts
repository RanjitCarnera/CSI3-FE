import styled from "styled-components";
import { TkCard } from "@components/ui/TkCard";

export const PersonCardBaseStyles = styled(TkCard)`
	margin: 12px 5px;
	padding: 10px;
	position: relative;
	box-shadow: 0 0 4px rgb(121 149 165 / 30%);
	border-radius: 8px;
	background: #eaeffa;

	&.dragging {
		opacity: 0.5;
	}

	.person {
		color: var(--text);
		font-size: 0.9rem;
	}

	.p-card-body {
		padding: 0;
	}

	.p-button {
		padding: 0;
	}

	.roles,
	.dates {
		font-size: 0.8rem;
	}

	@media print {
		* {
			-webkit-print-color-adjust: exact;
			color-adjust: exact;
		}
	}
`;

export const UtilizationStatus = styled.div`
	position: absolute;
	top: -8px;
	right: -3px;
	border-radius: 2px;
	font-size: 0.7rem;
	color: white;
	padding: 2px 10px;

	@media print {
		position: absolute;
		top: -1px;
		padding: 2px 10px;
		font-size: 0.6rem;
	}
	&.not-assigned {
		background-color: var(--success);
	}

	&.underallocated {
		background-color: var(--warning);
	}

	&.overallocated {
		background-color: var(--danger);
	}
`;
