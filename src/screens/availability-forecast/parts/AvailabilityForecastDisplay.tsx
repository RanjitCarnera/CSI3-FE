import Color from "colorjs.io";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";
import { useSelector } from "react-redux";
import { TkCard } from "../../../components/ui/TkCard";
import { selectAvailabilityForecast } from "../../../redux/AvailabilityForecastSlice";

const getMonth = (ym: string) => ym.split("-")[1];
const getYear = (ym: string) => ym.split("-")[0];

const ZERO_COLOR = new Color("#F0E199");
const GOOD_COLOR = new Color("#6CFF22");
const BAD_COLOR = new Color("#D64550");

const GOOD_RANGE = ZERO_COLOR.range(GOOD_COLOR, { space: "srgb", outputSpace: "srgb" });
const BAD_RANGE = ZERO_COLOR.range(BAD_COLOR, { space: "srgb", outputSpace: "srgb" });

export const AvailabilityForecastDisplay = () => {
	const availabilityForecast = useSelector(selectAvailabilityForecast);
	const showingProjects = availabilityForecast?.summary.every((fc) => fc.projects >= 0);

	return (
		<div className="w-12">
			{!availabilityForecast && (
				<div className="text-center mt-5">
					<h2>Please select your parameters on the left.</h2>
				</div>
			)}

			{availabilityForecast && (
				<TkCard className="overflow-auto w-12">
					<table style={{ borderSpacing: 0 }}>
						<thead>
							<tr>
								<th className="p-3 border-right-1 border-bottom-1">Year</th>
								{availabilityForecast.yearAndMonths?.map((yearMonth) => {
									if (
										availabilityForecast.yearAndMonths.find(
											(ym) => getYear(ym) === getYear(yearMonth),
										) === yearMonth
									) {
										const colspan = availabilityForecast.yearAndMonths.filter(
											(ym) => getYear(ym) === getYear(yearMonth),
										).length;
										return (
											<th
												className="p-3 text-center border-right-1 border-bottom-1"
												colSpan={colspan}
											>
												{getYear(yearMonth)}
											</th>
										);
									} else {
										return null;
									}
								})}
							</tr>
							<tr>
								<th className="p-3 border-right-1 border-bottom-2">Position</th>
								{availabilityForecast.yearAndMonths?.map((ym) => (
									<th className="p-3 text-center border-right-1 border-bottom-2">
										{getMonth(ym)}
									</th>
								))}
							</tr>
						</thead>

						<tbody>
							{availabilityForecast.rows?.map((row, rowIndex) => {
								return (
									<>
										<tr>
											<td className="p-3 border-right-2 border-bottom-1">
												{row.roles.map((r) => r.name).join(" & ")}
											</td>
											{availabilityForecast.yearAndMonths?.map(() => (
												<th className="p-3 text-center border-right-1 border-bottom-1"></th>
											))}
										</tr>
										<tr>
											<td className="p-3 pl-4 border-right-2 border-bottom-1">
												Needed
											</td>
											{row.columns?.map((col) => {
												return (
													<td className="p-3 text-center border-right-1 border-bottom-1">
														{col.needed}
													</td>
												);
											})}
										</tr>
										<tr>
											<td className="p-3 pl-4 border-right-2 border-bottom-1">
												Available{" "}
												{availabilityForecast.countPossibleUtilizationNotPeople
													? "Slots"
													: "Resources"}
											</td>
											{row.columns?.map((col, columnIndex) => {
												const target =
													"availablePeople" +
													rowIndex +
													"-" +
													columnIndex;
												return (
													<td className="p-3 text-center border-right-1 border-bottom-1">
														<Tooltip
															target={"#" + target}
															content={col.availablePeople
																.map((p) => p.name)
																.join(", ")}
														/>
														<span id={target}>{col.available}</span>
													</td>
												);
											})}
										</tr>
										<tr>
											<td className="p-3 pl-4 border-right-2 border-bottom-2">
												Difference
											</td>
											{row.columns?.map((col) => {
												return (
													<td
														className="p-3 text-center border-right-1 border-bottom-2"
														style={{
															backgroundColor: differenceToColor(
																col.difference,
															),
														}}
													>
														{col.difference}
													</td>
												);
											})}
										</tr>
									</>
								);
							})}

							<tr>
								<td className="p-3 pl-4 font-bold border-right-2 border-bottom-1">
									Needed
								</td>
								{availabilityForecast.summary?.map((col) => {
									return (
										<td className="p-3 text-center border-right-1 border-bottom-1">
											{col.needed}
										</td>
									);
								})}
							</tr>
							<tr>
								<td className="p-3 pl-4 font-bold border-right-2 border-bottom-1">
									Available{" "}
									{availabilityForecast.countPossibleUtilizationNotPeople
										? "Slots"
										: "Resources"}
								</td>
								{availabilityForecast.summary?.map((col) => {
									return (
										<td className="p-3 text-center border-right-1 border-bottom-1">
											{col.available}
										</td>
									);
								})}
							</tr>
							<tr>
								<td
									className={classNames({
										"p-3 pl-4 font-bold border-right-2": true,
										"border-bottom-2": !showingProjects,
										"border-bottom-1": showingProjects,
									})}
								>
									Difference
								</td>
								{availabilityForecast.summary?.map((col) => {
									return (
										<td
											className={classNames({
												"p-3 text-center border-right-1": true,
												"border-bottom-2": !showingProjects,
												"border-bottom-1": showingProjects,
											})}
											style={{
												backgroundColor: differenceToColor(col.difference),
											}}
										>
											{col.difference}
										</td>
									);
								})}
							</tr>
							{availabilityForecast.summary.every((fc) => fc.projects >= 0) && (
								<tr>
									<td className="p-3 pl-4 font-bold border-right-2 border-bottom-2">
										Projects
									</td>
									{availabilityForecast.summary?.map((col) => {
										return (
											<td
												className="p-3 text-center border-right-1 border-bottom-2"
												style={{
													backgroundColor: differenceToColor(
														col.projects,
													),
												}}
											>
												{col.projects}
											</td>
										);
									})}
								</tr>
							)}
						</tbody>
					</table>
				</TkCard>
			)}
		</div>
	);
};

const differenceToColor = (difference: number): string => {
	const percentage = Math.max(0, Math.min(1, Math.abs(difference) / 50.0));
	if (difference < 0) {
		return BAD_RANGE(percentage).toString();
	} else {
		return GOOD_RANGE(percentage).toString();
	}
};
