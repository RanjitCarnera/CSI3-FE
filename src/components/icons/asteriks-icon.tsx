export const AsteriskIcon = ({ width = 24, height = 24, color = "black" }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="0 0 24 24"
			fill={color}
		>
			<path d="M12 2C6.487 2 2 6.487 2 12s4.487 10 10 10 10-4.487 10-10S17.513 2 12 2zm0 17c-3.859 0-7-3.141-7-7s3.141-7 7-7 7 3.141 7 7-3.141 7-7 7zm-1-13v7h2v-7h-2z" />
		</svg>
	);
};
