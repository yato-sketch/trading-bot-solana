import * as qs from "qs";
import axios from "axios";
import { ETHERSCAN_API_KEY, ETHERSCAN_API_URL } from "./constants";

export async function checkContractVerification(guid: string) {
	let data = qs.stringify({
		module: "contract",
		action: "checkverifystatus",
		guid: guid.toString(),
		apikey: ETHERSCAN_API_KEY,
	});

	let config = {
		method: "get",
		maxBodyLength: Infinity,
		url: ETHERSCAN_API_URL,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		data: data,
	};

	return axios
		.request(config)
		.then((response) => {
			//console.log(JSON.stringify(response.data));
			return response.data;
		})
		.catch((error) => {
			//return error;
			console.log(error);
		});
}
