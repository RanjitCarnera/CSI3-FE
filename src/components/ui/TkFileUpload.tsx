import {
	FileUpload,
	type FileUploadBeforeSendEvent,
	type FileUploadProps,
} from "primereact/fileupload";
import { useSelector } from "react-redux";
import { selectLoginData } from "@redux/AuthSlice";

interface OwnProps extends FileUploadProps {
	additionalHeaders?: Record<string, string>;
	tagsForUpload?: string[];
}

export const TkFileUpload = ({ tagsForUpload, url, additionalHeaders, ...rest }: OwnProps) => {
	const loginData = useSelector(selectLoginData);

	const onBeforeSend = (ev: FileUploadBeforeSendEvent) => {
		if (loginData) {
			ev.xhr.setRequestHeader("Authorization", loginData.accessToken!);
		}
		if (tagsForUpload) {
			ev.xhr.setRequestHeader("X-File-Tags", tagsForUpload.join(","));
		}
		if (additionalHeaders) {
			Object.entries(additionalHeaders).forEach((entry) => {
				ev.xhr.setRequestHeader(entry[0], entry[1]);
			});
		}
	};

	return (
		<FileUpload
			{...rest}
			name={"file"}
			url={url ?? `${process.env.REACT_APP_API_BASE}/api/upload`}
			onBeforeSend={onBeforeSend}
		/>
	);
};
