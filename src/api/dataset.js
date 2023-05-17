import { default as axios } from "axios";
import { SERVER_URL } from "../constants";

export const uploadDataset = async function (file, dataset) {
	try {
		let token = localStorage.getItem("token");
		const form = new FormData();
		form.append("file", file, file.name);
		form.append("dataset", dataset);

		const response = await axios.post(SERVER_URL + "/upload/dataset", form, {
			headers: {
				"Content-Type": `multipart/form-data`,
				Authorization: `Bearer ${token}`,
			},
		});
		if (response.status === 200) {
			return response.data;
		}
	} catch (error) {
		console.log(error.message);
	}
};

export const getDatasets = async function () {
	try {
		const response = await axios.get(SERVER_URL + "/datasets");
		if (response.status === 200) {
			return response.data.repositories;
		}
	} catch (error) {
		console.log(error.message);
	}
};

export const searchDatasets = async function (name) {
	try {
		const response = await axios.get(SERVER_URL + "/datasets/search?name=" + name);
		if (response.status === 200) {
			return response.data.repositories;
		}
	} catch (error) {
		console.log(error.message);
	}
};

export const userDatasets = async function (user) {
	try {
		let token = localStorage.getItem("token");

		const response = await axios.get(SERVER_URL + "/datasets/user/" + user, {
			headers: {
				"Content-Type": `application/json`,
				Authorization: "Bearer " + token,
			},
		});
		if (response.status === 200) {
			return response.data.repositories;
		}
	} catch (error) {
		console.log(error.message);
	}
};

export const getDatasetVersion = async function (name) {
	try {
		let token = localStorage.getItem("token");

		const response = await axios.get(
			SERVER_URL + "/repository/tags?name=" + name,
			{
				headers: {
					"Content-Type": `application/json`,
					Authorization: "Bearer " + token,
				},
			}
		);
		if (response.status === 200) {
			return response.data.repositories;
		}
	} catch (error) {
		console.log(error.message);
	}
};
