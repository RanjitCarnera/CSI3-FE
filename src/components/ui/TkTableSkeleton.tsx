import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";

interface OwnProps {
	columnNames: string[];
}

export const TkTableSkeleton = ({ columnNames }: OwnProps) => {
	return (
		<DataTable<any> value={[1, 2, 3, 4]}>
			{columnNames.map((columnName) => (
				<Column
					key={columnName}
					header={columnName}
					body={() => {
						return <Skeleton />;
					}}
				/>
			))}
		</DataTable>
	);
};
