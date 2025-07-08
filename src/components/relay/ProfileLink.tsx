import { Menu } from "primereact/menu";
import { type MenuItem } from "primereact/menuitem";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PERSONAL_DATA_SCREEN_PATH } from "@screens/personal-data";
import { logout } from "../../redux/AuthSlice";
import { selectCurrentUser } from "../../redux/CurrentUserSlice";
import { TkButton } from "../ui/TkButton";

interface OwnProps {
	className?: string;
}

export const ProfileLink = ({ className }: OwnProps) => {
	const currentUser = useSelector(selectCurrentUser);

	const dispatch = useDispatch();
	const menu = useRef<Menu>();

	const menuItems: MenuItem[] = [];

	menuItems.push({
		label: "Settings",
		icon: "pi pi-cog",
		url: PERSONAL_DATA_SCREEN_PATH,
		template: (item) => <ProfileLinkMenuItem item={item} />,
	});
	menuItems.push({
		label: "Logout",
		icon: "pi pi-sign-out",
		command: () => dispatch(logout()),
		template: (item) => <ProfileLinkMenuItem item={item} />,
	});

	return (
		<div className={className}>
			<TkButton
				className="p-button-text text-700 font-bold text-sm"
				label={currentUser?.user?.name}
				icon="pi pi-user"
				onClick={(event) => {
					menu.current!.toggle(event);
				}}
			/>
			<Menu model={menuItems} popup ref={menu as any} />
		</div>
	);
};

interface OwnProps2 {
	item: MenuItem;
	collapsed?: boolean;
}

const ProfileLinkMenuItem = ({ item }: OwnProps2) => {
	const navigate = useNavigate();
	return (
		<div
			onClick={(e) => {
				if (item.url) {
					navigate(item.url);
				} else if (item.command) {
					item.command({ item, originalEvent: e });
				}
			}}
			className="cursor-pointer p-2 justify-content-center border-round font-bold flex align-items-center hover:bg-gray-200 mb-2"
		>
			{item.icon && (
				<span className={`flex align-items-center mr-3`}>
					{" "}
					<i className={"text-lg " + item.icon} />
				</span>
			)}
			<span className="text-sm">{item?.label}</span>
		</div>
	);
};
