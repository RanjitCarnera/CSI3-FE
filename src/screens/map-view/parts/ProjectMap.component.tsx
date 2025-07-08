import React, { useEffect } from "react";
import { graphql } from "babel-plugin-relay/macro";
import { useFragment } from "react-relay";
import { Marker } from "../../project-view/project-view.interface";
import { ProjectMap_ProjectFragment$key } from "../../../__generated__/ProjectMap_ProjectFragment.graphql";
import { useSelector } from "react-redux";
import { selectFetchedPeople } from "../../../redux/MapSlice";

const PROJECT_FRAGMENT = graphql`
	fragment ProjectMap_ProjectFragment on ProjectInScenario {
		id
		project {
			name
			address {
				latitude
				longitude
			}
		}
	}
`;

interface Props {
	className?: string;
	projectRef: ProjectMap_ProjectFragment$key;
}

export const ProjectMap = ({ className, projectRef }: Props) => {
	const { project } = useFragment<ProjectMap_ProjectFragment$key>(PROJECT_FRAGMENT, projectRef);
	const myLatlng = new google.maps.LatLng(
		project.address?.latitude || 70,
		project.address?.longitude || 70,
	);

	const people = useSelector(selectFetchedPeople);
	const markers: Marker[] = people
		.slice(0, 10)
		.map((p) => ({
			lat: p.address?.latitude,
			lng: p.address?.longitude,
			tooltip: p.name,
		}))
		.filter((e) => e) as Marker[];

	const mapOptions: google.maps.MapOptions = {
		zoom: 8,
		center: myLatlng,
		mapTypeId: "roadmap",
	};
	useEffect(() => {
		const mapElement = document.getElementById("map");
		if (!mapElement) return;
		const map = new google.maps.Map(mapElement, mapOptions);

		const projectInfoBox = new google.maps.InfoWindow({
			content: project.name,
		});
		const marker = new google.maps.Marker({
			map: map,
			position: {
				lat: project.address?.latitude || 70,
				lng: project.address?.longitude || 70,
			},
			title: project?.name,
			icon: "http://maps.google.com/mapfiles/kml/paddle/wht-blank.png",
		});
		google.maps.event.addListener(marker, "click", function () {
			projectInfoBox.open(map, marker);
		});

		markers.forEach((m) => {
			const personInfoBox = new google.maps.InfoWindow({
				content: m.tooltip,
			});
			const personMarker = new google.maps.Marker({
				map: map,
				position: {
					lat: m.lat,
					lng: m.lng,
				},
				title: m.tooltip,
				icon: m.icon || "http://maps.google.com/mapfiles/kml/paddle/red-circle.png",
			});
			google.maps.event.addListener(personMarker, "click", function () {
				personInfoBox.open(map, personMarker);
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [markers]);

	return (
		<div id={"map"} className={className}>
			Map
		</div>
	);
};
