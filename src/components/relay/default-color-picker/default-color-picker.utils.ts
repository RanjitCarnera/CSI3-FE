/**
 * The color picker value is returned without the '#' symbol.
 * This function adds the '#' symbol to the value if it is not already present.
 * @param defaultValue
 */
export const getFieldValue = (defaultValue: string) => {
	if (defaultValue.includes("#")) return defaultValue;
	else if (defaultValue.length > 0) return `#${defaultValue}`;
	else return "";
};
