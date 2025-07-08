type PageFormat = "A0" | "A1" | "A2" | "A3" | "A4" | "A5";
type Orientation = "portrait" | "landscape";

export function getAvailableRows(
	format: PageFormat,
	orientation: Orientation,
	laneHeightPx = 50,
): number {
	const mmToPx = (mm: number) => (mm / 25.4) * 96;

	const sizesInMM: Record<PageFormat, { width: number; height: number }> = {
		A0: { width: 841, height: 1189 },
		A1: { width: 594, height: 841 },
		A2: { width: 420, height: 594 },
		A3: { width: 297, height: 420 },
		A4: { width: 210, height: 297 },
		A5: { width: 148, height: 210 },
	};

	const size = sizesInMM[format];
	const pageHeightMM = orientation === "portrait" ? size.height : size.width;
	const pageHeightPx = mmToPx(pageHeightMM);

	const usableHeight = pageHeightPx - 50;
	return Math.floor(usableHeight / laneHeightPx);
}
