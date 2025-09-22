import React, { type ReactNode } from "react";
import styled from "styled-components";
import { TkCard } from "./TkCard";
import HarkinsBackground from "../../assets/harkins-background.jpg";
import TWLogo from "../../assets/teamweave-logo-black.svg";

interface OwnProps {
	children: ReactNode;
}

export const AuthScreenBase = ({ children }: OwnProps) => {
	return (
		<AuthBackground className="flex flex-grow-1 justify-content-center align-items-center p-sidebar-full">
			<AuthCardWrapper
				header={
					<div className="text-center pt-6">
						<a target={"_blank"} href={"https://teamweave.io"}>
							<Logo
								alt={"Harkins"}
								src={TWLogo}
								style={{
									transform: "scale(1.5)",
								}}
							/>
						</a>
					</div>
				}
			>
				{children}
			</AuthCardWrapper>
		</AuthBackground>
	);
};

export const AuthCardWrapper = styled(TkCard)`
	max-width: 512px;
	width: 100%;

	z-index: 1;
	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
`;

const Logo = styled.img`
	max-width: 160px;
`;

export const AuthBackground = styled.div`
	&:before {
		background: url(${HarkinsBackground}) no-repeat center;
		background-size: cover;
		z-index: 0;
		content: "";
		height: 100%;
		width: 100%;
		position: absolute;
		opacity: 80%;
	}

	&:after {
		z-index: 0;
		content: "";
		height: 100%;
		width: 100%;
		position: absolute;
		background-color: var(--dark);
		opacity: 50%;
	}
`;
