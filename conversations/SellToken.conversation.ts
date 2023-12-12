import { formatUnits, isAddress } from "ethers";
import { MyContext } from "../bot";
import { CreateWallet, getWalletAddress } from "../web3";
import { MyConversation } from "./withdrawEth.conversations";
import { sellMenu } from "../views";
import { IERC20__factory } from "../types/contracts";
import { instantiateERC20Token } from "../web3/instantiate";
import { getTokenInfo } from "../handlers/fetchTokenDetails.handler";
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
			`Token Details: \n \n priceUsd::${priceUsd} USD \n  PairAddress: ${pairAddress} \n Volume: \n h24: ${
				volume.h24
			} h6: ${volume.h6} h1:${volume.h1} m5: ${
				volume.m5
			} \n \n  Liquidity:  ${
				liquidity.usd
			} USD\n \n  PriceChange:\n h24:${priceChange.h24} h6:${
				priceChange.h6
			} h1:${priceChange.h1} m5:${
				priceChange.m5
			}  Symbol: ${symbol} \n \n   Decimal : ${decimal}  \n \n  Balance:${formatUnits(
				tokenBalance,
				decimal
			)}`,
			{ reply_markup: sellMenu(tokenAddress, 1) }
		);
	} else {
		await ctx.reply("Invalid Token Address");
	}
}
