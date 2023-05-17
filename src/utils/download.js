import { toast } from "react-toastify";

export function download(file, version) {
	try {
		// Check access
		if (!file || !version) {
			// Open token buy popup
			return toast("Please buy token's to access the datasets", {
				type: "info",
			});
		}
		// Check if logged in.
		let token = localStorage.getItem("token");
		console.log(token);
		if (!token || token === "" || token === "undefined") {
			return toast("Please connect wallet to download", { type: "info" });
		}
		// Check access
		downloadURI(file, version);
	} catch (error) {
		console.log(error);
		toast(error.message);
	}
}

function downloadURI(uri, name) {
	const link = document.createElement("a");
	link.href = uri;
	link.download = name;
	link.click();
}
