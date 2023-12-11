import { isAddress, parseEther } from "ethers";
import { MyConversation } from ".";
import { MyContext } from "../bot";
import { InlineKeyboard } from "grammy";
import { CreateWallet } from "../web3";
import { buyMenu } from "../views";
import { buyTokenHandler } from "../handlers/buyToken.handler";
const { getDecimals, getSymbol } = new CreateWallet();
export async function buyTokenConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	await ctx.reply("kindly Input Token Address :");
	let response = await conversation.waitFor(":text");
	const tokenAddress = response.msg.text;
	const rpc = process.env.RPC;
	if (ctx.session.autoBuy) {
		const amountToBuy = ctx.session.buyAmount;
		const slippage = ctx.session.slippage;
		await buyTokenHandler(
			parseFloat(slippage),
			BigInt(parseEther(amountToBuy)),
			tokenAddress,
			ctx.session.privateKey
		);
	} else {
		const symbol = await getSymbol(tokenAddress, rpc);
		const decimal = await getDecimals(tokenAddress, rpc);
		await ctx.reply(
			`Token Details: \n  Symbol: ${symbol} \n \n   Decimal : ${decimal} `,
			{ reply_markup: buyMenu(tokenAddress) }
		);
	}
}
