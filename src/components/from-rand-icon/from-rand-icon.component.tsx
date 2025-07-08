import { classNames } from "primereact/utils";
import React from "react";
import RandIcon from "@assets/asterik.png";
import { ImageWrapper } from "@components/from-rand-icon/from-rand-icon.styles";
import { type FromRandIconProps } from "@components/from-rand-icon/from-rand-icon.types";
import { TkButtonLink } from "@components/ui/TkButtonLink";

export const FromRandIcon = ({ tooltip }: FromRandIconProps) => {
	return (
		<TkButtonLink
			className={classNames("p-0 w-auto warning mx-1")}
			icon={<ImageWrapper alt="rand" src={RandIcon} height={12} width={12} />}
			tooltip={tooltip}
		/>
	);
};
