export * from "./login.error";
export * from "./api.error";
export * from "./web3.error";

export async function GenericError(msg: string) {
	console.log(`API ERROR: ${msg}`);
}
