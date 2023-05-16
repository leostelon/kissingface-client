export function downloadURI(uri, name) {
	const link = document.createElement("a");
	link.href = uri;
	link.download = name;
	link.click();
}
