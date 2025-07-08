export const COLOR_DANGER = "#da5b79"
export const COLOR_WARNING = "#ffd643"
export const COLOR_SUCCESS = "#83e16c"
export const COLOR_UNKNOWN = "#6b7588"

export const interpolateColor = (c0: string, c1: string, f: number, opacity: number = 1) => {
    const c0d = c0.substring(1, 8).match(/.{1,2}/g)!.map((oct) => parseInt(oct, 16) * (1 - f))
    const c1d = c1.substring(1, 8).match(/.{1,2}/g)!.map((oct) => parseInt(oct, 16) * f)
    let ci = [0, 1, 2].map(i => Math.min(Math.round(c0d[i] + c1d[i]), 255))
    return `rgba(${ci[0]}, ${ci[1]}, ${ci[2]}, ${opacity})`
};

export function getGradient(ctx: any, chartArea: any) {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, COLOR_DANGER);
    gradient.addColorStop(0.5, COLOR_WARNING);

    gradient.addColorStop(1, COLOR_SUCCESS);
    return gradient;
}


export function gradientFunction(context: any) {
    const chart = context.chart;
    const {ctx, chartArea} = chart;

    if (!chartArea) {
        // This case happens on initial chart load
        return;
    }
    return getGradient(ctx, chartArea);
}

export type ColorType = "good" | "medium" | "bad" | "unknown"

export const getColor = (type: ColorType, opacity: number = 1) => {
    switch (type) {
        case "good":
            return interpolateColor(COLOR_SUCCESS, COLOR_SUCCESS, 1, opacity);
        case "medium":
            return interpolateColor(COLOR_WARNING, COLOR_WARNING, 1, opacity);
        case "bad":
            return interpolateColor(COLOR_DANGER, COLOR_DANGER, 1, opacity);
        case "unknown":
            return interpolateColor(COLOR_UNKNOWN, COLOR_UNKNOWN, 1, opacity);

    }
}
