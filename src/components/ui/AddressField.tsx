import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { useSelector } from "react-redux";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type ValidatedFieldConfig } from "./ValidatedField";

export interface Address {
	city: string;
	country: string;
	latitude?: number | null;
	longitude?: number | null;
	postalCode: string;
	state: string;
	lineOne: string;
}

export function AddressField(fieldConfig: ValidatedFieldConfig<Address>) {
	const hasPermissions = useSelector(selectHasPermissions);
	const hasPrivateDataReadPermission = hasPermissions([
		"UserInAccountPermission_PrivateData_Read",
	]);

	const { ref } = usePlacesWidget({
		options: {
			types: ["geocode"],
		},
		apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
		onPlaceSelected: (place) => {
			let lineOne = "";
			let postcode = "";
			let locality = "";
			let state = "";
			let country = "";

			// @ts-expect-error remove once typings fixed
			for (const component of place?.address_components) {
				const componentType = component.types[0];

				switch (componentType) {
					case "street_number":
						lineOne = `${component.long_name} ${lineOne}`;
						break;
					case "route":
						lineOne += component.short_name;
						break;
					case "postal_code":
						postcode = `${component.long_name}${postcode}`;
						break;
					case "postal_code_suffix":
						postcode = `${postcode}-${component.long_name}`;
						break;
					case "locality":
						locality = component.long_name;
						break;
					case "administrative_area_level_1":
						state = component.short_name;
						break;
					case "country":
						country = component.long_name;
						break;
				}
			}

			fieldConfig.updateField({
				lineOne,
				city: locality,
				postalCode: postcode,
				country,
				state,
				latitude: place.geometry?.location?.lat(),
				longitude: place.geometry?.location?.lng(),
			});
		},
	});

	const parseFieldValue = (value?: string) => {
		if (hasPrivateDataReadPermission) return value ?? "";
		else return "********";
	};

	return (
		<div>
			<div className="mb-2">
				{hasPrivateDataReadPermission && (
					<InputText
						name={fieldConfig.fieldName + "search"}
						disabled={!hasPrivateDataReadPermission}
						ref={ref as any}
						value={undefined}
						placeholder={"Search"}
						className={classNames({ "p-invalid": !fieldConfig.isValid })}
					/>
				)}
			</div>
			<div className="grid mb-2">
				<div className="col-12">
					<InputText
						name={fieldConfig.fieldName + "street"}
						disabled={true}
						value={parseFieldValue(fieldConfig.fieldValue?.lineOne)}
						placeholder={"Address"}
						className={classNames({ "p-invalid": !fieldConfig.isValid })}
					/>
				</div>
			</div>
			<div className="grid">
				<div className="col-6">
					<InputText
						name={fieldConfig.fieldName + "city"}
						disabled={true}
						value={parseFieldValue(fieldConfig.fieldValue?.city)}
						placeholder={"City"}
						className={classNames({ "p-invalid": !fieldConfig.isValid })}
					/>
				</div>

				<div className="col-3">
					<InputText
						name={fieldConfig.fieldName + "postalCode"}
						disabled={true}
						value={parseFieldValue(fieldConfig.fieldValue?.postalCode)}
						placeholder={"ZIP"}
						className={classNames({ "p-invalid": !fieldConfig.isValid })}
					/>
				</div>
				<div className="col-3">
					<Dropdown
						name={fieldConfig.fieldName + "state"}
						disabled={true}
						value={parseFieldValue(fieldConfig.fieldValue?.state)}
						options={Object.entries(states).map((state) => {
							return {
								value: state[0],
								label: state[1],
							};
						})}
						placeholder={"State"}
						className={classNames({ "p-invalid": !fieldConfig.isValid })}
					/>
				</div>
			</div>
			<div className="grid">
				<div className="col-6">
					<InputText
						name={fieldConfig.fieldName + "latitude"}
						disabled={true}
						value={parseFieldValue(fieldConfig.fieldValue?.latitude?.toString())}
						placeholder={"Latitude"}
						className={classNames({ "p-invalid": !fieldConfig.isValid })}
					/>
				</div>
				<div className="col-6">
					<InputText
						name={fieldConfig.fieldName + "Longitude"}
						disabled={true}
						value={parseFieldValue(fieldConfig.fieldValue?.longitude?.toString())}
						placeholder={"Longitude"}
						className={classNames({ "p-invalid": !fieldConfig.isValid })}
					/>
				</div>
			</div>
		</div>
	);
}

const states = {
	AL: "Alabama",
	AK: "Alaska",
	AS: "American Samoa",
	AZ: "Arizona",
	AR: "Arkansas",
	CA: "California",
	CO: "Colorado",
	CT: "Connecticut",
	DE: "Delaware",
	DC: "District Of Columbia",
	FM: "Federated States Of Micronesia",
	FL: "Florida",
	GA: "Georgia",
	GU: "Guam",
	HI: "Hawaii",
	ID: "Idaho",
	IL: "Illinois",
	IN: "Indiana",
	IA: "Iowa",
	KS: "Kansas",
	KY: "Kentucky",
	LA: "Louisiana",
	ME: "Maine",
	MH: "Marshall Islands",
	MD: "Maryland",
	MA: "Massachusetts",
	MI: "Michigan",
	MN: "Minnesota",
	MS: "Mississippi",
	MO: "Missouri",
	MT: "Montana",
	NE: "Nebraska",
	NV: "Nevada",
	NH: "New Hampshire",
	NJ: "New Jersey",
	NM: "New Mexico",
	NY: "New York",
	NC: "North Carolina",
	ND: "North Dakota",
	MP: "Northern Mariana Islands",
	OH: "Ohio",
	OK: "Oklahoma",
	OR: "Oregon",
	PW: "Palau",
	PA: "Pennsylvania",
	PR: "Puerto Rico",
	RI: "Rhode Island",
	SC: "South Carolina",
	SD: "South Dakota",
	TN: "Tennessee",
	TX: "Texas",
	UT: "Utah",
	VT: "Vermont",
	VI: "Virgin Islands",
	VA: "Virginia",
	WA: "Washington",
	WV: "West Virginia",
	WI: "Wisconsin",
	WY: "Wyoming",
};
