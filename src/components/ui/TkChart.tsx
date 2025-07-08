import {Chart} from "primereact/chart";
import {CSSProperties, useRef} from "react";
import {TkButton} from "./TkButton";
import styled from "styled-components";
import {classNames} from "primereact/utils";
import {ChartData, ChartOptions} from "chart.js";

interface OwnProps {
    className?: string
    chartName?: string

    height?: string
    style?: CSSProperties,
    data?: ChartData
    options?: ChartOptions
}

export const TkChart = ({className, chartName, height, style, data, options}: OwnProps) => {
    const chartRef = useRef<Chart>()

    return <HoverArea className={classNames("relative", className)}>
        <TkButton
            className="absolute right-0 bottom-0 z-5"
            icon="pi pi-download"
            label="Download as PNG"
            onClick={() => {
                downloadBase64File(chartRef.current?.getBase64Image(), (chartName || "chart") + ".png")
            }
            }/>

        <Chart
            ref={chartRef as any}
            height={height}

            style={style}

            data={data}
            options={options}
        />
    </HoverArea>
}

const HoverArea = styled.div`
  button {
    visibility: hidden !important;
  }

  &:hover {
    button {
      visibility: visible !important;
    }
  }
`

function downloadBase64File(base64Data: string, fileName: string) {
    const downloadLink = document.createElement("a");
    downloadLink.href = base64Data;
    downloadLink.download = fileName;
    downloadLink.click();
}
