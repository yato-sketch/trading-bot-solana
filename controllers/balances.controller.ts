import { Bot, CommandContext, Context, InlineKeyboard } from "grammy";
import { showDeployedTokenHandler } from "../handlers/showDeployedTokens";
import { MyContext } from "../bot";
import { sellMenu, settingMenu } from "../views";
import { setSessions } from "../handlers";
import { fetchNewUserById, updateUser } from "../models";
import { CreateWallet, getWalletAddress } from "../web3";
import { formatUnits, id } from "ethers";
import { getTokenInfo } from "../handlers/fetchTokenDetails.handler";
import { addHyperLink, boldenText, makeCopiable } from "../utils";
import { getAllOrderByUserId } from "../models/trades.model";
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
	const orders = await getAllOrderByUserId(ctx.chat.id.toString());
	await setSessions(ctx);
	const { pairAddress, priceUsd, volume, liquidity, priceChange } =
		tokenDetails;
	// find by contract address
	const ordersByContractAddress = orders.myTrades.filter(
		(el) => el.tokenAddress === contractAddress
	);
	let totalCost = 0;
	let totalTokens = 0;
	for (let i = 0; i < ordersByContractAddress.length; i++) {
		const { priceBoughtAt, amount } = ordersByContractAddress[i];
		totalCost = parseFloat(priceBoughtAt);
		totalTokens += parseFloat(amount);
	}
	// Calculate current value of all tokens
	const currentValue = parseFloat(balance) * parseFloat(priceUsd);
	console.log(currentValue);

	// Calculate profit
	const profit = currentValue - totalCost;

	// Calculate net profit after subtracting total costs
	const netProfit =
		parseFloat(priceUsd) * parseFloat(balance.toString()) -
		parseFloat(balance) * parseFloat(totalCost.toString());
	//calculate contract address order
	const profitPercentage =
		((parseFloat(priceUsd) * parseFloat(balance.toString())) /
			parseFloat(balance)) *
		parseFloat(totalCost.toString()) *
		100;
	const netProfitPercentage =
		(netProfit / parseFloat(balance)) *
		parseFloat(totalCost.toString()) *
		100;

	if (msgId > 0) {
		//edit
		await ctx.api.editMessageText(
			ctx.chat.id,
			msgId,
			`🔘 ${boldenText(symbol)} (${addHyperLink(
				symbol.toLowerCase(),
				"https://ftmscan.com/address/" + pairAddress
			)}) 🔘 \n \n💰 Price USD: ${boldenText(
				makeCopiable(priceUsd)
			)} USD \n🔗 PairAddress: ${boldenText(
				makeCopiable(pairAddress)
			)} \n📉 Volume: \n⏳ H24: ${boldenText(
				makeCopiable(volume.h24)
			)}  \n⏳ H6: ${boldenText(
				makeCopiable(volume.h6)
			)}\n⏳ M5: ${boldenText(
				makeCopiable(volume.m5)
			)} \n \n📈Liquidity📈:  ${boldenText(
				makeCopiable(liquidity.usd)
			)} USD 💰 \n \n \nProfit and Loss\nNet Profit %: ${boldenText(
				makeCopiable(netProfitPercentage.toFixed(0))
			)}  \nNet Profit : ${boldenText(
				makeCopiable(netProfit.toString())
			)}\n Profit Percentage:${boldenText(
				makeCopiable(profitPercentage.toFixed(0))
			)}\n \n   \n💰 Your Token  Balance: ${boldenText(
				makeCopiable(balance.toString())
			)} ${symbol} \n🔣 Token Decimal:${boldenText(
				makeCopiable(decimal.toString())
			)} \n💸 Balance Worth:${boldenText(
				makeCopiable(
					(
						parseFloat(priceUsd) * parseFloat(balance.toString())
					).toString()
				)
			)} USD`,
			{
				reply_markup: sellMenu(contractAddress, id, pairAddress),
				parse_mode: "HTML",
			}
		);
	} else {
		await ctx.reply(
			`🔘 ${boldenText(symbol)} (${addHyperLink(
				symbol.toLowerCase(),
				"https://ftmscan.com/address/" + pairAddress
			)}) 🔘 \n \n💰 Price USD: ${boldenText(
				makeCopiable(priceUsd)
			)} USD \n🔗 PairAddress: ${boldenText(
				makeCopiable(pairAddress)
			)} \n📉 Volume: \n⏳ H24: ${boldenText(
				makeCopiable(volume.h24)
			)}  \n⏳ H6: ${boldenText(
				makeCopiable(volume.h6)
			)} \n⏳H1: ${boldenText(
				makeCopiable(volume.h1)
			)} \n⏳ M5: ${boldenText(
				makeCopiable(volume.m5)
			)} \n \n📈Liquidity📈:  ${boldenText(
				makeCopiable(liquidity.usd)
			)} USD 💰 \n \nProfit and Loss\nNet Profit %: ${boldenText(
				makeCopiable(netProfitPercentage.toFixed(2).toString())
			)} \nNet Profit : ${boldenText(
				makeCopiable(netProfit.toString())
			)}\n \n \n💰 Your Token  Balance: ${boldenText(
				makeCopiable(balance.toString())
			)} ${symbol} \n🔣 Token Decimal: ${boldenText(
				makeCopiable(decimal.toString())
			)} \n💸 Balance Worth: ${boldenText(
				makeCopiable(
					(
						parseFloat(priceUsd) * parseFloat(balance.toString())
					).toString()
				)
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
