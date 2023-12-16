import axios from "axios";
export async function getTokenInfo(tokenAddress: string) {
	let config = {
		method: "get",
		maxBodyLength: Infinity,
		url: `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`,
	};

	return axios
		.request(config)
		.then((response) => {
			//console.log(response.data);
			if (response.data.pairs) {
				return response.data.pairs[0];
			}
		})
		.catch((error) => {
			console.log(error);
		});
}
export async function getTokenSecDetails(tokenAddress: string) {
	let config = {
		method: "get",
		maxBodyLength: Infinity,
		url: `https://api.gopluslabs.io/api/v1/token_security/250?contract_addresses=${tokenAddress}`,
		headers: {},
	};

	return axios
		.request(config)
		.then((response) => {
			//console.log(response.data);
			return response.data.result;
		})
		.catch((error) => {
			console.log(error);
		});
}
