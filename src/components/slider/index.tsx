import { Slider as PRSlider } from "primereact/slider";
import styled from "styled-components";

export const Slider = styled(PRSlider)`
	&.p-slider .p-slider-range {
		background: #214ce2;
	}
	.p-slider-handle {
		border-color: #1b3fbb;
		background: white;
	}
`;
