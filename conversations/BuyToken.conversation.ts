import { formatEther, isAddress, parseEther } from "ethers";
import { MyConversation } from ".";
import { MyContext } from "../bot";
import { InlineKeyboard } from "grammy";
import { CreateWallet, getWalletAddress } from "../web3";
import { buyMenu } from "../views";
import { buyTokenHandler } from "../handlers/buyToken.handler";
import {
	getTokenInfo,
	getTokenSecDetails,
} from "../handlers/fetchTokenDetails.handler";
import { buyRouting } from "../handlers/routing.handler";
import { WETH } from "../handlers";
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
				// await buyTokenHandler(
				// 	parseFloat(slippage),
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
					rpc,
					parseFloat(slippage),
					BigInt(parseEther(amountToBuy)),
					amountToBuy.toString(),
					ctx
				);
			}
		} else {
			const symbol = await getSymbol(tokenAddress, rpc);
			const decimal = await getDecimals(tokenAddress, rpc);
			const tokenDetails = await getTokenInfo(tokenAddress);
			const SecDetails = await getTokenSecDetails(tokenAddress);

			if (SecDetails) {
				const {
					buy_tax,

					is_honeypot,
					sell_tax,
					lp_holder_count,
					lp_total_supply,
					total_supply,
					honeypot_with_same_creator,
					creator_address,
				} = SecDetails[tokenAddress.toLowerCase()];
				const {
					pairAddress,
					priceUsd,
					volume,
					liquidity,
					priceChange,
					fdv,
				} = tokenDetails;

				await ctx.reply(
					`Token Details: \n priceUsd::${priceUsd} USD \n  PairAddress: ${pairAddress} \n Volume: \n h24: ${volume.h24} h6: ${volume.h6} h1:${volume.h1} m5: ${volume.m5} \n \n  Liquidity:  ${liquidity.usd} USD\n \n  PriceChange:\n h24:${priceChange.h24} h6:${priceChange.h6} h1:${priceChange.h1} m5:${priceChange.m5} \n \n   Symbol: ${symbol} \n \n   Decimal : ${decimal} \n  Contract Sec Info\n Creator Address: ${creator_address} \n Honey Pot with Same Creator: ${honeypot_with_same_creator} \n Total Supply: ${total_supply} \n lp Total Supply: ${lp_total_supply} \n Lp Holder Count: ${lp_holder_count} \n Sell Tax: ${sell_tax} \n Buy Tax: ${buy_tax} \n Is honeyPot:${is_honeypot}`,
					{ reply_markup: buyMenu(tokenAddress) }
				);
			} else {
				const {
					pairAddress,
					priceUsd,
					volume,
					liquidity,
					priceChange,
					fdv,
				} = tokenDetails;
				await ctx.reply(
					`Token Details: \n priceUsd::${priceUsd} USD \n  PairAddress: ${pairAddress} \n Volume: \n h24: ${volume.h24} h6: ${volume.h6} h1:${volume.h1} m5: ${volume.m5} \n \n  Liquidity:  ${liquidity.usd} USD\n \n  PriceChange:\n h24:${priceChange.h24} h6:${priceChange.h6} h1:${priceChange.h1} m5:${priceChange.m5} \n \n   Symbol: ${symbol} \n \n   Decimal : ${decimal}  \n  No Contract Sec Info\n  `,
					{ reply_markup: buyMenu(tokenAddress) }
				);
			}
		}
	} else {
		await ctx.reply("Invalid Token Address");
	}
}
