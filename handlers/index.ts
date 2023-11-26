import { MyContext } from "../bot";
import apiCalls from "../utils/apiCall";
export * from ".";
export * from "./inlineButtons.handler";
export * from "./GenerateWallet.handler";
import { customStateContext, myState } from "../utils";
import { Composer } from "grammy";
import { CreateWallet, TokenDeployer } from "../web3";
import { ethers } from "ethers";
const API = new apiCalls();
const listenerComposer = new Composer();
export async function callbackHandler() {}

export const setSessions = async (ctx: MyContext) => {
	const userDetails = await API.fetchUserByTgId(ctx.chat?.id?.toString());
	const pK = userDetails ? userDetails[0].PrivateKey : "";

	ctx.session.privateKey = pK;
};

export const deployTokenHandler = async (ctx: MyContext) => {};
export { listenerComposer };
