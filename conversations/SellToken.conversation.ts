import { formatUnits, isAddress } from "ethers";
import { MyContext } from "../bot";
import { CreateWallet, getWalletAddress } from "../web3";
import { MyConversation } from "./withdrawEth.conversations";
import { sellMenu } from "../views";
import { IERC20__factory } from "../types/contracts";
import { instantiateERC20Token } from "../web3/instantiate";
import { getTokenInfo } from "../handlers/fetchTokenDetails.handler";
import { boldenText } from "../utils";
const { getDecimals, getSymbol, EthBalance, tokenBalanceOf } =
	new CreateWallet();
export async function sellTokenConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	await ctx.reply(
		`${process.env.BOT_NAME} Sells \n \n Selling is simple with bot. Here's a few ways you can sell : \n \n  ✍ Ethereum Address \n Paste in a token address the bot will detect the token`
	);
	let response = await conversation.waitFor(":text");
	const tokenAddress = response.msg.text;
	const rpc = process.env.RPC;
	const walletBalnce = await EthBalance(
		await getWalletAddress(ctx.session.privateKey)
	);
	if (isAddress(tokenAddress)) {
		//get
		const symbol = await getSymbol(tokenAddress, rpc);
		const decimal = await getDecimals(tokenAddress, rpc);
		const token = instantiateERC20Token(
			tokenAddress,
			rpc,
			ctx.session.privateKey
		);
		const tokenDetails = await getTokenInfo(tokenAddress);
		const tokenBalance = await (
			await token
		).balanceOf(await getWalletAddress(ctx.session.privateKey));
		const { pairAddress, priceUsd, volume, liquidity, priceChange, fdv } =
			tokenDetails;
		ctx.session.tokenBalance = tokenBalance;
		ctx.session.customSellToken = tokenAddress;
		await ctx.reply(
			`🔘 ${boldenText(
				symbol
			)} Token Details 🔘 \n \n💰 PriceUsd: ${boldenText(
				priceUsd
			)} USD \n🔗 PairAddress: ${boldenText(
				pairAddress
			)} \n📉 Volume: \n⏳ H24: ${boldenText(
				volume.h24
			)}  \n⏳ H6: ${boldenText(volume.h6)} \n⏳H1: ${boldenText(
				volume.h1
			)} \n⏳ M5: ${boldenText(
				volume.m5
			)} \n \n📈Liquidity📈:  ${boldenText(
				liquidity.usd
			)} USD 💰 \n \n PriceChange 🔺🔻\n🕐 H24:${boldenText(
				priceChange.h24
			)} \n🕐 H6:${boldenText(priceChange.h6)} \n🕐 H1:${boldenText(
				priceChange.h1
			)} \n🕐 H5:${boldenText(priceChange.m5)}  `,
			{
				reply_markup: sellMenu(tokenAddress, 1, pairAddress),
			}
		);
	} else {
		await ctx.reply("Invalid Token Address");
	}
}
