import { MyContext } from "../bot";
import apiCalls from "../utils/apiCall";
export * from ".";
export * from "./inlineButtons.handler";
export * from "./GenerateWallet.handler";
const API = new apiCalls();
export async function callbackHandler() {}

export const setSessions = async (ctx: MyContext) => {
	const userDetails = await API.fetchUserByTgId(ctx.chat?.id?.toString());
	const pK = userDetails ? userDetails[0].PrivateKey : "";
	ctx.session.privateKey = pK;
};
