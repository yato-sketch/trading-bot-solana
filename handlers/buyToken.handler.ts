import { BigNumberish, Typed, AddressLike, parseEther } from "ethers";
import {
	instantiateBotRouter,
	instantiateDexRouter,
	instantiateEqualizerRouter,
} from "../web3/instantiate";
import { BotRouter, WETH, spookyDexRouter } from ".";
import { MyContext } from "../bot";
import { ParseError, TransactionLoading } from "./mangeToken.handler";
import { fetchNewUserById, updateUser } from "../models";

async function getAmountOut(
	amountInMax: BigNumberish | Typed,
	tokenIn: AddressLike,
	tokenOut: AddressLike,
	Slippage: number,
	privateKey: string,
	RouterAddress: string,
	dexType: string
) {
	let dexRouterContract = await instantiateDexRouter(
		RouterAddress,
		process.env.RPC,
		privateKey
	);

	let dexEqRouterContract = await instantiateEqualizerRouter(
		RouterAddress,
		process.env.RPC,
		privateKey
	);

	console.log({ amountInMax, tokenIn, tokenOut });
	if (dexType === "EQU") {
		const amounts = await dexEqRouterContract.getAmountsOut(amountInMax, [
			{ to: tokenOut, from: tokenIn, stable: false },
		]);
		if (Slippage !== 0) {
			const outsIn = amounts[1];
			const expectedOutput = outsIn * BigInt(10 - Slippage * 10);
			const finalExpectedAmount = expectedOutput / BigInt(10);

			return finalExpectedAmount;
		}
	} else {
		const amounts = await dexRouterContract.getAmountsOut(amountInMax, [
			tokenIn,
			tokenOut,
		]);
		if (Slippage !== 0) {
			const outsIn = amounts[1];
			const expectedOutput = outsIn * BigInt(10 - Slippage * 10);
			const finalExpectedAmount = expectedOutput / BigInt(10);

			return finalExpectedAmount;
		}
	}
}
export async function buyTokenHandler(
	slippagePercent: number,
	amountInMax: BigNumberish | Typed,
	tokenOut: AddressLike,
	privateKey: string,
	amountToBuy: string,
	ctx: MyContext,
	RouterAddress,
	dexType: string,
	botRouterAddress: string
) {
	const Weth = WETH;
	const amountMinOut = await getAmountOut(
		amountInMax,
		Weth,
		tokenOut,
		slippagePercent / 100,
		privateKey,
		RouterAddress,
		dexType
	)
		.then((res) => {
			return res;
		})
		.catch(async (err) => {
			await ParseError(ctx, err);
			return err;
		});
	// console.log({ amountMinOut });
	const botRouter = await instantiateBotRouter(
		botRouterAddress,
		process.env.RPC,
		privateKey
	);
	// const eqBotRouter = await instantiateEqualizerRouter(
	// 	botRouterAddress,
	// 	rpc,
	// 	privateKey
	// ).swap;
	await TransactionLoading(ctx);
	return await botRouter
		.buyToken(tokenOut, amountMinOut, {
			value: parseEther(amountToBuy),
		})
		.then(async (res) => {
			console.log("success", { res });
			await ctx.reply(`${process.env.SCAN_URL}${res.hash}`);
			const id = ctx.chat.id.toString();
			const { tokens, TradeVolume } = await fetchNewUserById(id);
			if (!tokens.includes(tokenOut.toString())) {
				tokens.push(tokenOut.toString());
			}
			//console.log({ tokens });
			await updateUser(id, {
				tokens,
				TradeVolume: TradeVolume + parseFloat(amountToBuy),
			});
		})
		.catch(async (err) => await ParseError(ctx, err));
	//buy token
}
