import { Skeleton } from "primereact/skeleton";
import React from "react";
import { PersonCardSkeleton } from "@components/person-card";
import {
	COLUMN_WIDTH,
	HEADER_SIZE,
	MARGIN_BETWEEN_LANES,
	MARGIN_BETWEEN_PEOPLE,
} from "@screens/staff-view/parts/staff-view.utils";
import { Loader } from "../../../components/ui/Loader";

export const StaffViewLoadingSkeleton = () => {
	// @ts-expect-error
	const fakePeople = [...Array(5).keys()];

	// @ts-expect-error
	const fakeIntervals = [...Array(50).keys()];

	return (
		<div className="flex">
			<div className="mr-3" style={{ minWidth: 200 }}>
				<div
					className="flex align-items-center justify-content-center"
					style={{ height: HEADER_SIZE, paddingBottom: MARGIN_BETWEEN_LANES }}
				>
					<Skeleton />
				</div>
				{fakePeople.map((x, index) => {
					return (
						<div
							key={"fake-person-" + index}
							className=""
							style={{
								minHeight: 50,
								maxHeight: 50,
								height: 50,
								marginBottom: MARGIN_BETWEEN_PEOPLE,
							}}
						>
							<PersonCardSkeleton
								className="flex-grow-1 m-0 "
								style={{ height: "100%" }}
							/>
						</div>
					);
				})}
			</div>

			<div style={{ overflow: "scroll" }}>
				<div className="flex">
					{fakeIntervals.map((x, index) => {
						return (
							<div
								className="flex flex-column mr-3"
								key={"fake-header-" + index}
								style={{
									minWidth: COLUMN_WIDTH,
									height: HEADER_SIZE,
									color: "#7D85A7",
									fontSize: 11,
									fontWeight: 500,
								}}
							>
								<>
									<div>
										<Skeleton /> -
									</div>
									<div>
										<Skeleton />
									</div>
								</>
							</div>
						);
					})}
				</div>

				<div className="relative">
					<div className="mt-5" style={{ zIndex: 100 }}>
						<Loader />
					</div>

					{fakeIntervals.map((interval, index) => {
						return (
							<div
								key={"separator-" + index}
								style={{
									left: index * COLUMN_WIDTH,
									height: fakePeople.length * 75,
									top: 0,
									borderLeft: "1px solid #d2d7e1",
									width: 1,
									position: "absolute",
									zIndex: 10,
								}}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};
