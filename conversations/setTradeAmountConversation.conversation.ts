import { parseEther } from "ethers";
import { MyConversation } from ".";
import { MyContext } from "../bot";
import { WETH, setSessions } from "../handlers";
import { buyTokenHandler } from "../handlers/buyToken.handler";
import { updateUser } from "../models";
import { buyRouting } from "../handlers/routing.handler";

export async function setTradeAmountConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	await setSessions(ctx);
	await ctx.deleteMessage();
	await ctx.reply(
		"Pls kindly Enter the Amount FTM to buy when you click on buy: "
	);
	let response = await conversation.waitFor(":text");
	if (Number.isInteger(parseInt(response.msg.text))) {
		await ctx.reply(`Buy Trading Amount Set `);
		const tokenAddress = ctx.session.customBuyToken;
		const amountToBuy = response.msg.text;
		const slippage = 10;
		// await buyTokenHandler(
		// 	slippage,
		// 	BigInt(parseEther(amountToBuy)),
		// 	tokenAddress,
		// 	ctx.session.privateKey,
		// 	amountToBuy.toString(),
		// 	ctx
		// );
		await buyRouting(
			WETH,
			tokenAddress,
			ctx.session.privateKey,
			process.env.RPC,
			slippage,
			BigInt(parseEther(amountToBuy)),
			amountToBuy.toString(),
			ctx
		);
	}
}
