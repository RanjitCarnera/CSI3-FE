interface OwnProps {
	value?: number;
	formatter?: (value: number) => string;
}

const defaultFormatter = (value: number) =>
	Math.abs(value).toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});

const millionFormatter = (value: number) =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value / 1000000) + "M";

export const CurrencyDisplayUtil = {
	formatter: {
		default: defaultFormatter,
		million: millionFormatter,
	},
};
export const formatCurrency = (
	value: number,
	formatter: (value: number) => string = defaultFormatter,
) => `${value < 0 ? "(" : ""}${formatter(value)}${value < 0 ? ")" : ""}`;

export const CurrencyDisplay = ({ value, formatter }: OwnProps) => {
	if (!value) {
		return null;
	}

	return <>{formatCurrency(value, formatter)}</>;
};
