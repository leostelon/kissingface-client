import { default as axios } from "axios";
import { SERVER_URL } from "../constants";

export const createToken = async function (body) {
	try {
		let token = localStorage.getItem("token");

		const response = await axios.post(SERVER_URL + "/token/create", body, {
			headers: {
				"Content-Type": `application/json`,
				Authorization: `Bearer ${token}`,
			},
		});
		return response;
	} catch (error) {
		console.log(error.message);
	}
};
