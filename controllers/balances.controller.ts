import { Bot, CommandContext, Context, InlineKeyboard } from "grammy";
import { showDeployedTokenHandler } from "../handlers/showDeployedTokens";
import { MyContext } from "../bot";
import { sellMenu, settingMenu } from "../views";
import { setSessions } from "../handlers";
import { fetchNewUserById, updateUser } from "../models";
import { CreateWallet, getWalletAddress } from "../web3";
import { formatUnits, id } from "ethers";
import { getTokenInfo } from "../handlers/fetchTokenDetails.handler";
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
	id: number
) => {
	const tokenDetails = await getTokenInfo(contractAddress);
	await setSessions(ctx);
	const { pairAddress, priceUsd, volume, liquidity, priceChange } =
		tokenDetails;
	await ctx.reply(
		`Token Details \n \n \n priceUsd::${priceUsd} USD \n  PairAddress: ${pairAddress} \n Volume: \n h24: ${
			volume.h24
		} h6: ${volume.h6} h1:${volume.h1} m5: ${
			volume.m5
		} \n \n  Liquidity:  ${liquidity.usd} USD\n \n  PriceChange:\n h24:${
			priceChange.h24
		} h6:${priceChange.h6} h1:${priceChange.h1} m5:${
			priceChange.m5
		} Token Symbol:  ${symbol} \n Your Token  Balance: ${balance.toString()} \n Token Decimal: ${decimal.toString()}`,
		{ reply_markup: sellMenu(contractAddress, id) }
	);
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
export const showSingleOrder = async (ctx: MyContext, orderId: number) => {
	//get order buy id and render
	const order = await getOrders(ctx);
	const theOrder = await order[orderId];
	const prev = orderId - 1;
	const forword = orderId + 1;
	const { decimal, symbol, token, balance } = theOrder;
	await tokenBalanceView(ctx, symbol, balance, decimal, token, orderId);
};

export async function balancesController(ctx: MyContext) {
	const orders = await getOrders(ctx);
	if (orders && orders.length > 0) {
		await showSingleOrder(ctx, 0);
	} else {
		console.log("here");
		await ctx.reply(`No Order Available `);
	}
}
