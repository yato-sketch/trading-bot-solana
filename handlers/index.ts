import { MyContext } from "../bot";
export * from ".";
export * from "./inlineButtons.handler";
export * from "./GenerateWallet.handler";
import {
	addHyperLink,
	boldenText,
	customStateContext,
	makeCopiable,
	myState,
} from "../utils";
import { Composer } from "grammy";
import { CreateWallet, TokenDeployer, getWalletAddress } from "../web3";
import { ethers, isAddress, parseEther } from "ethers";
import { fetchNewUserById } from "../models";
import { callBackQueryComposer } from "./inlineButtons.handler";
import { buyMenu } from "../views";
import { buyTokenHandler } from "./buyToken.handler";
import { commandsComposer } from "../commands";
import { buyRouting } from "./routing.handler";
import { getTokenInfo, getTokenSecDetails } from "./fetchTokenDetails.handler";
const listenerComposer = new Composer();
export async function callbackHandler() {}

export const setSessions = async (ctx: MyContext) => {
	//	await ctx.conversation.exit();
	const userDetails = await fetchNewUserById(ctx.chat?.id?.toString());
	const pK = userDetails ? userDetails.privateKey : "";
	const { autoBuy, slippage, buyAmount, sellAmount, tokens } = userDetails;

	ctx.session.privateKey = pK;
	ctx.session.autoBuy = autoBuy;
	ctx.session.slippage = slippage;
	ctx.session.buyAmount = buyAmount;
	ctx.session.sellAmount = sellAmount;
};

export const WETH = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83";
export const BotRouter = "0xA7c59f010700930003b33aB25a7a0679C860f29c";
export const spookyDexRouter = "0xF491e7B69E4244ad4002BC14e878a34207E38c29";
export const spookyDexFactory = "0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3";
export const equalizerRouter = "0x2aa07920E4ecb4ea8C801D9DFEce63875623B285";
export const equalizerBotRouter = "0x22753E4264FDDc6181dc7cce468904A80a363E44";
export const DefaultRefWallet = "0x829ceb39FeE0155d63530de02450AbC3b6652602";
export const deployTokenHandler = async (ctx: MyContext) => {};
const { getDecimals, getSymbol, EthBalance } = new CreateWallet();
callBackQueryComposer.on("msg", async (ctx) => {
	const address = ctx.msg.text;
	const rpc = process.env.RPC;
	if (isAddress(address)) {
		await setSessions(ctx);
		const walletBalnce = await EthBalance(
			await getWalletAddress(ctx.session.privateKey)
		);

		if (ctx.session.autoBuy == true) {
			const amountToBuy = ctx.session.buyAmount;
			const slippage = ctx.session.slippage;
			console.log(parseInt(walletBalnce), parseInt(amountToBuy));
			if (
				parseInt(amountToBuy) &&
				parseFloat(amountToBuy) > 0 &&
				parseFloat(amountToBuy) >= parseFloat(walletBalnce)
			) {
				await ctx.reply(
					`TRADE  AMOUNT IS MORE THAN WALLET BALANCE OR NOT SET`
				);
			} else {
				await buyRouting(
					WETH,
					address,
					ctx.session.privateKey,
					rpc,
					parseFloat(slippage),
					BigInt(parseEther(amountToBuy)),
					amountToBuy.toString(),
					ctx
				);
			}
		} else {
			const symbol = await getSymbol(address, rpc);
			const decimal = await getDecimals(address, rpc);
			const tokenDetails = await getTokenInfo(address);
			const SecDetails = await getTokenSecDetails(address);
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
				} = SecDetails[address.toLowerCase()];
				const {
					pairAddress,
					priceUsd,
					volume,
					liquidity,
					priceChange,
					fdv,
				} = tokenDetails;

				await ctx.reply(
					`🪙 ${boldenText(symbol)} (${addHyperLink(
						symbol.toLowerCase(),
						"https://ftmscan.com/address/" + pairAddress
					)}) \n \nPrice USD: ${priceUsd} USD \nAddress: ${boldenText(
						makeCopiable(pairAddress)
					)} \n \n${boldenText("Volume")}: \n⏳ H24: ${boldenText(
						makeCopiable(volume.h24)
					)}  \n⏳ H6: ${boldenText(
						makeCopiable(volume.h6)
					)} \n⏳ M5: ${boldenText(
						makeCopiable(volume.m5)
					)} \n \n📈Liquidity📈:  ${boldenText(
						makeCopiable(liquidity.usd)
					)} USD 💰  \n  \n🔣 Symbol: ${symbol}  \n🔣 Decimal:${makeCopiable(
						decimal
					)}\n  \n ${boldenText(
						`🔒 ${boldenText("Contract Sec Info")} 🔒`
					)}\n \n👨‍🎨 Creator Address: ${boldenText(
						makeCopiable(creator_address)
					)} \n🎭 Honey Pot with Same Creator: ${boldenText(
						makeCopiable(honeypot_with_same_creator)
					)}\n  \n📊 Total Supply: ${boldenText(
						makeCopiable(total_supply)
					)} \n💰 lp Total Supply: ${makeCopiable(
						makeCopiable(lp_total_supply)
					)} \n👤 Lp Holder Count: ${boldenText(
						makeCopiable(lp_holder_count)
					)}\n  \n📝 Sell Tax: ${boldenText(
						makeCopiable(sell_tax)
					)} \n📝 Buy Tax: ${boldenText(
						makeCopiable(buy_tax)
					)} \n🍯 Is honeyPot:${boldenText(
						makeCopiable(is_honeypot)
					)}`,
					{
						reply_markup: buyMenu(address, pairAddress),
						parse_mode: "HTML",
					}
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
					`🪙 ${boldenText(symbol)} ${addHyperLink(
						symbol,
						"https://ftmscan.com/"
					)}} \nPrice USD: ${priceUsd} USD \nPairAddress: ${pairAddress} \nVolume: \n⏳ H24: ${boldenText(
						volume.h24
					)}  \n⏳ H6: ${boldenText(volume.h6)} \n⏳H1: ${boldenText(
						volume.h1
					)} \n⏳ M5: ${boldenText(
						volume.m5
					)} \n \n📈Liquidity📈:  ${boldenText(
						liquidity.usd
					)} USD 💰   \n  No Contract Sec Info\n  `,
					{ reply_markup: buyMenu(address, pairAddress) }
				);
			}
		}
	} else {
		callBackQueryComposer.use(commandsComposer);
		return;
	}
});
export { listenerComposer };
