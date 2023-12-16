import { BigNumberish, Typed, AddressLike, parseEther, ethers } from "ethers";
import {
	instantiateBotRouter,
	instantiateDexRouter,
	instantiateEqualizerRouter,
} from "../web3/instantiate";
import { BotRouter, WETH, spookyDexRouter } from ".";
import { MyContext } from "../bot";
import { ParseError, TransactionLoading } from "./mangeToken.handler";
import { fetchNewUserById, updateUser } from "../models";
import { getGasPrice } from "../web3";

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
		console.log({ Slippage });
		if (Slippage !== 0) {
			const outsIn = amounts[1];
			const multiplier = 100 - Slippage * 100;
			const expectedOutput = outsIn * BigInt(multiplier);
			const finalExpectedAmount = expectedOutput / BigInt(100);

			return finalExpectedAmount;
		}
	} else {
		const amounts = await dexRouterContract.getAmountsOut(amountInMax, [
			tokenIn,
			tokenOut,
		]);
		if (Slippage !== 0) {
			const outsIn = amounts[1];
			const multiplier = 100 - Slippage * 100;
			const expectedOutput = outsIn * BigInt(multiplier);
			const finalExpectedAmount = expectedOutput / BigInt(100);

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

	//	const signer = new ethers.Wallet(privateKey, provider);
	const gasPrice = await getGasPrice(process.env.RPC);
	// const gasLimit= (await botRouter.buyToken())
	await TransactionLoading(ctx);
	return await botRouter
		.buyToken(tokenOut, amountMinOut, {
			value: parseEther(amountToBuy),
			gasPrice,
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
