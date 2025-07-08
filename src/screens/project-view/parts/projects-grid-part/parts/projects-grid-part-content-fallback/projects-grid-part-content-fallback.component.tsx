import { Skeleton } from "primereact/skeleton";
import React from "react";

export const ProjectsGridContentFallback = () => {
	return (
		<div className="flex flex-wrap mt-2 pt-3 overflow-y-scroll gap-2">
			{Array.from({ length: 16 })
				.fill(0)
				.map((_, i) => (
					<Skeleton
						key={i}
						width={"300px"}
						height={"166px"}
						style={{
							borderRadius: "12px",
						}}
					/>
				))}
		</div>
	);
};
