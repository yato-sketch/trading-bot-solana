import { MyContext } from "../bot";
export * from ".";
export * from "./inlineButtons.handler";
export * from "./GenerateWallet.handler";
import { customStateContext, myState } from "../utils";
import { Composer } from "grammy";
import { CreateWallet, TokenDeployer, getWalletAddress } from "../web3";
import { ethers, isAddress, parseEther } from "ethers";
import { fetchNewUserById } from "../models";
import { callBackQueryComposer } from "./inlineButtons.handler";
import { buyMenu } from "../views";
import { buyTokenHandler } from "./buyToken.handler";
import { commandsComposer } from "../commands";
const listenerComposer = new Composer();
export async function callbackHandler() {}

export const setSessions = async (ctx: MyContext) => {
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
export const BotRouter = "0x18E317A7D70d8fBf8e6E893616b52390EbBdb629";
export const spookyDexRouter = "0xF491e7B69E4244ad4002BC14e878a34207E38c29";
export const equalizerRouter = "0x2aa07920E4ecb4ea8C801D9DFEce63875623B285";
export const equalizerBotRouter = "0xD5ac451B0c50B9476107823Af206eD814a2e2580";
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
					address,
					ctx.session.privateKey,
					amountToBuy.toString(),
					ctx
				);
			}
		} else {
			const symbol = await getSymbol(address, rpc);
			const decimal = await getDecimals(address, rpc);
			await ctx.reply(
				`Token Details: \n  Symbol: ${symbol} \n \n   Decimal : ${decimal} `,
				{ reply_markup: buyMenu(address) }
			);
		}
	} else {
		callBackQueryComposer.use(commandsComposer);
		return;
	}
});
export { listenerComposer };
