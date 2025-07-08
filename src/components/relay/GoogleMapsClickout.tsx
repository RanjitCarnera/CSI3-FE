import { graphql } from "babel-plugin-relay/macro";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { useFragment } from "react-relay";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type GoogleMapsClickout_AddressFragment$key } from "../../__generated__/GoogleMapsClickout_AddressFragment.graphql";
import { TkButtonLink } from "../ui/TkButtonLink";

const ADDRESS_FRAGMENT = graphql`
	fragment GoogleMapsClickout_AddressFragment on Address {
		latitude
		longitude
	}
`;

interface OwnProps {
	className?: string;
	addressFragmentRef: GoogleMapsClickout_AddressFragment$key | null;
}

export const GoogleMapsClickout = ({ className, addressFragmentRef }: OwnProps) => {
	const address = useFragment<GoogleMapsClickout_AddressFragment$key>(
		ADDRESS_FRAGMENT,
		addressFragmentRef,
	);
	const hasPermissions = useSelector(selectHasPermissions);
	const hasMapsReadPermissions = hasPermissions(["UserInAccountPermission_Maps_Read"]);
	if (!hasMapsReadPermissions) return <Fragment />;

	if (address?.latitude && address?.longitude) {
		return (
			<a
				className={className}
				rel="noreferrer"
				target="_blank"
				href={`http://www.google.com/maps/place/${address.latitude},${address.longitude}`}
			>
				<TkButtonLink icon="pi pi-map" />
			</a>
		);
	} else {
		return null;
	}
};
