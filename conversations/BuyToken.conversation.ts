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
import { boldenText } from "../utils";
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
					`${boldenText(
						symbol
					)} Details \nPrice USD: ${priceUsd} USD \nPairAddress: ${pairAddress} \nVolume: \n⏳ H24: ${boldenText(
						volume.h24
					)}  \n⏳ H6: ${boldenText(volume.h6)} \n⏳H1: ${boldenText(
						volume.h1
					)} \n⏳ M5: ${boldenText(
						volume.m5
					)} \n \n📈Liquidity📈:  ${boldenText(
						liquidity.usd
					)} USD 💰  \n PriceChange 🔺🔻\n🕐 H24:${boldenText(
						priceChange.h24
					)} \n🕐 H6:${boldenText(
						priceChange.h6
					)} \n🕐 H1:${boldenText(
						priceChange.h1
					)} \n🕐 H5:${boldenText(
						priceChange.m5
					)}  \n  \n🔣 Symbol: ${symbol}  \n🔣 Decimal:${decimal}\n  \n ${boldenText(
						"🔒 Contract Sec Info 🔒"
					)}\n👨‍🎨 Creator Address: ${boldenText(
						creator_address
					)} \n🎭 Honey Pot with Same Creator: ${boldenText(
						honeypot_with_same_creator
					)} \n📊 Total Supply: ${boldenText(
						total_supply
					)} \n💰 lp Total Supply: ${lp_total_supply} \n👤 Lp Holder Count: ${boldenText(
						lp_holder_count
					)} \n📝 Sell Tax: ${boldenText(
						sell_tax
					)} \n📝 Buy Tax: ${boldenText(
						buy_tax
					)} \n🍯 Is honeyPot:${boldenText(is_honeypot)}`,
					{ reply_markup: buyMenu(tokenAddress), parse_mode: "HTML" }
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
					`${boldenText(
						symbol
					)} Details \nPrice USD: ${priceUsd} USD \nPairAddress: ${pairAddress} \nVolume: \n⏳ H24: ${boldenText(
						volume.h24
					)}  \n⏳ H6: ${boldenText(volume.h6)} \n⏳H1: ${boldenText(
						volume.h1
					)} \n⏳ M5: ${boldenText(
						volume.m5
					)} \n \n📈Liquidity📈:  ${boldenText(
						liquidity.usd
					)} USD 💰  \n PriceChange 🔺🔻\n🕐 H24:${boldenText(
						priceChange.h24
					)} \n🕐 H6:${boldenText(
						priceChange.h6
					)} \n🕐 H1:${boldenText(
						priceChange.h1
					)} \n🕐 H5:${boldenText(
						priceChange.m5
					)}  \n  \n  No Contract Sec Info\n  `,
					{ reply_markup: buyMenu(tokenAddress) }
				);
			}
		}
	} else {
		await ctx.reply("Invalid Token Address");
	}
}
