import { MyContext } from "../bot";
export * from ".";
export * from "./inlineButtons.handler";
export * from "./GenerateWallet.handler";
import { customStateContext, myState } from "../utils";
import { Composer } from "grammy";
import { CreateWallet, TokenDeployer } from "../web3";
import { ethers } from "ethers";
import { fetchNewUserById } from "../models";
import { callBackQueryComposer } from "./inlineButtons.handler";
const listenerComposer = new Composer();
export async function callbackHandler() {}

export const setSessions = async (ctx: MyContext) => {
	const userDetails = await fetchNewUserById(ctx.chat?.id?.toString());
	const pK = userDetails ? userDetails.privateKey : "";
	const { autoBuy, slippage, buyAmount, sellAmount } = userDetails;
	ctx.session.privateKey = pK;
	ctx.session.autoBuy = autoBuy;
	ctx.session.slippage = slippage;
	ctx.session.buyAmount = buyAmount;
	ctx.session.sellAmount = sellAmount;
};

export const WETH = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83";
export const BotRouter = "0x18E317A7D70d8fBf8e6E893616b52390EbBdb629";
export const spookyDexRouter = "0xF491e7B69E4244ad4002BC14e878a34207E38c29";
export const deployTokenHandler = async (ctx: MyContext) => {};

callBackQueryComposer.on("msg", (ctx) => {
	console.log("hererher");
});
export { listenerComposer };
