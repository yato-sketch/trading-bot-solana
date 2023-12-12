import { formatEther, isAddress, parseEther } from "ethers";
import { MyConversation } from ".";
import { MyContext } from "../bot";
import { InlineKeyboard } from "grammy";
import { CreateWallet, getWalletAddress } from "../web3";
import { buyMenu } from "../views";
import { buyTokenHandler } from "../handlers/buyToken.handler";
const { getDecimals, getSymbol, EthBalance } = new CreateWallet();
export async function buyTokenConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	await ctx.reply(
		`${process.env.BOT_NAME} Buys \n \n Buying is simple with Shuriken. Here's a few ways you can sell : \n \n  ✍ Ethereum Address \n Paste in a token address the bot will detect the token`
	);
	let response = await conversation.waitFor(":text");
	const tokenAddress = response.msg.text;
	const rpc = process.env.RPC;
	const walletBalnce = await EthBalance(
		await getWalletAddress(ctx.session.privateKey)
	);
	if (isAddress(tokenAddress)) {
		if (ctx.session.autoBuy) {
			const amountToBuy = ctx.session.buyAmount;
			const slippage = ctx.session.slippage;
			console.log(parseInt(walletBalnce), parseInt(amountToBuy));
			if (parseInt(amountToBuy) >= parseInt(walletBalnce)) {
				await ctx.reply(`TRADE  AMOUNT IS MORE THAN WALLET BALANCE`);
			} else {
				await buyTokenHandler(
					parseFloat(slippage),
					BigInt(parseEther(amountToBuy)),
					tokenAddress,
					ctx.session.privateKey,
					amountToBuy.toString(),
					ctx
				);
			}
		} else {
			const symbol = await getSymbol(tokenAddress, rpc);
			const decimal = await getDecimals(tokenAddress, rpc);
			await ctx.reply(
				`Token Details: \n  Symbol: ${symbol} \n \n   Decimal : ${decimal} `,
				{ reply_markup: buyMenu(tokenAddress) }
			);
		}
	} else {
		await ctx.reply("Invalid Token Address");
	}
}
