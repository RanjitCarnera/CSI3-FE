import { DataTable } from "primereact/datatable";
import { Message } from "primereact/message";
import React from "react";
import {
	getColumns,
	getRows,
} from "@components/relay/project-details-control/parts/table/table.util";
import { type TableProps } from "./table.interface";

export const SkillMatrixTable = ({ matrixWithCategory }: TableProps) => {
	if (!matrixWithCategory?.matrix.bodyRows.length)
		return <Message severity={"warn"} text={"No data to show."} />;
	const columns = getColumns(matrixWithCategory);
	const rows = getRows(matrixWithCategory);

	return (
		<div style={{ overflowX: "auto" }}>
			<DataTable value={rows}>{columns}</DataTable>
		</div>
	);
};
