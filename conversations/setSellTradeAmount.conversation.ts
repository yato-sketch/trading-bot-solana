import { parseEther } from "ethers";
import { MyConversation } from ".";
import { MyContext } from "../bot";
import { setSessions } from "../handlers";
import { buyTokenHandler } from "../handlers/buyToken.handler";
import { updateUser } from "../models";
import { sellTokenHandler } from "../handlers/sellToken.handler";

export async function setSellTradeAmountConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	await setSessions(ctx);
	//await ctx.deleteMessage();
	await ctx.reply("Pls kindly Enter the Percentage of PortFolio To Sell: ");
	let response = await conversation.waitFor(":text");
	if (Number.isInteger(parseInt(response.msg.text))) {
		const tokenAddress = ctx.session.customSellToken;
		const tokenBalance = ctx.session.tokenBalance;
		const sellingPercent = BigInt(
			(parseInt(response.msg.text) / 100) * 1000
		);
		const amountOut = BigInt(sellingPercent * tokenBalance) / BigInt(1000);
		const slippage = 40;
		await sellTokenHandler(
			slippage,
			amountOut,
			tokenAddress,
			ctx.session.privateKey,
			ctx
		);
	}
}
