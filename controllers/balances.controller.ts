import { Bot, CommandContext, Context, InlineKeyboard } from "grammy";
import { showDeployedTokenHandler } from "../handlers/showDeployedTokens";
import { MyContext } from "../bot";
import { sellMenu, settingMenu } from "../views";
import { setSessions } from "../handlers";
import { fetchNewUserById, updateUser } from "../models";
import { CreateWallet, getWalletAddress } from "../web3";
import { formatUnits, id } from "ethers";
import { getTokenInfo } from "../handlers/fetchTokenDetails.handler";
import { boldenText } from "../utils";
const { tokenBalanceOf, getSymbol, getDecimals } = new CreateWallet();

const testEditMenu = new InlineKeyboard()
	.text("back", "back")
	.text("front", "front");
const tokenBalanceView = async (
	ctx: MyContext,
	symbol: string,
	balance: string,
	decimal: string,
	contractAddress: string,
	id: number,
	msgId: number
) => {
	const tokenDetails = await getTokenInfo(contractAddress);
	await setSessions(ctx);
	const { pairAddress, priceUsd, volume, liquidity, priceChange } =
		tokenDetails;
	if (msgId > 0) {
		//edit
		await ctx.api.editMessageText(
			ctx.chat.id,
			msgId,
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
			)} \n🕐 H5:${boldenText(
				priceChange.m5
			)}   \n💰 Your Token  Balance: ${boldenText(
				balance.toString()
			)} ${symbol} \n🔣 Token Decimal:${boldenText(
				decimal.toString()
			)} \n💸 Balance Worth:${boldenText(
				(
					parseFloat(priceUsd) * parseFloat(balance.toString())
				).toString()
			)} USD`,
			{
				reply_markup: sellMenu(contractAddress, id, pairAddress),
				parse_mode: "HTML",
			}
		);
	} else {
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
			)} \n🕐 H5:${boldenText(
				priceChange.m5
			)}   \n💰 Your Token  Balance: ${boldenText(
				balance.toString()
			)} ${symbol} \n🔣 Token Decimal:${boldenText(
				decimal.toString()
			)} \n💸 Balance Worth:${boldenText(
				(
					parseFloat(priceUsd) * parseFloat(balance.toString())
				).toString()
			)} USD`,
			{
				reply_markup: sellMenu(contractAddress, id, pairAddress),
				parse_mode: "HTML",
			}
		);
	}

	// if (ctx.msg) {
	// 	const msgId = ctx.msg.message_id;
	// 	console.log({ msgId });
	// }
};
export const getOrders = async (ctx: MyContext) => {
	const userId = ctx.chat.id.toString();
	const { tokens } = await fetchNewUserById(userId);
	const address = await getWalletAddress(ctx.session.privateKey);
	const rpc = process.env.RPC;
	let newtrades: Promise<{
		balance: string;
		decimal: any;
		symbol: any;
		token: any;
	}>[] = [];
	if (tokens.length > 0) {
		const trades = tokens.map(async (token) => ({
			balance: formatUnits(
				await tokenBalanceOf(address, token, rpc),
				await getDecimals(token, rpc)
			),
			decimal: await getDecimals(token, rpc),
			symbol: await getSymbol(token, rpc),
			token: token,
		}));

		for (const el of trades) {
			if (parseFloat((await el).balance) > 0.0) {
				newtrades.push(el);
			}
		}
		if (newtrades.length > 0) {
			return newtrades;
		} else {
			return;
		}
	} else {
		return;
	}
};
export const showSingleOrder = async (
	ctx: MyContext,
	orderId: number,
	msg: number
) => {
	//get order buy id and render

	const order = await getOrders(ctx);
	const theOrder = await order[orderId];
	const { decimal, symbol, token, balance } = theOrder;
	await tokenBalanceView(ctx, symbol, balance, decimal, token, orderId, msg);
};

export async function balancesController(ctx: MyContext) {
	const orders = await getOrders(ctx);
	if (orders && orders.length > 0) {
		await showSingleOrder(ctx, 0, 0);
	} else {
		console.log("here");
		await ctx.reply(`No Order Available `);
	}
}
