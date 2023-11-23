import { Composer, Context } from "grammy";
import { createToken } from "../views/create_token.view";
import { MyContext } from "../bot";
import { TokenDeployer } from "../web3";
import { CreateWallet } from "../web3";
import { setSessions } from ".";
import { ethers } from "ethers";
const CallBackMap: Map<string, any> = new Map();
CallBackMap.set("create-token", async (ctx: MyContext) => {
	ctx.deleteMessage();
	createToken(ctx);
});
const callBackQueryComposer = new Composer();
callBackQueryComposer.on("callback_query:data", async (ctx) => {
	const data = ctx.callbackQuery.data;
	await setSessions(ctx as any);

	// if (data === "deploy-token") {
	// }
	if (data) {
		CallBackMap.get(data)(ctx);
	}

	await ctx.answerCallbackQuery();
});
export { callBackQueryComposer };
