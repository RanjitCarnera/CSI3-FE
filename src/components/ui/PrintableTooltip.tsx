import { Tooltip } from "@thekeytechnology/framework-react-components";
import styled from "styled-components";

export const PrintableTooltip = styled(Tooltip)`
	@media print {
		-webkit-print-color-adjust: exact;
		color-adjust: exact;
	}
`;
