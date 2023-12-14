import { BigNumberish, Typed, AddressLike, parseEther, ethers } from "ethers";
import {
	instantiateBotRouter,
	instantiateDexRouter,
	instantiateERC20Token,
	instantiateEqualizerRouter,
} from "../web3/instantiate";
import { WETH } from ".";
import { MyContext } from "../bot";
import { ParseError, TransactionLoading } from "./mangeToken.handler";
import { pointsHandler } from "./points.handler";
import { fetchNewUserById } from "../models";
import { getWalletAddress } from "../web3";

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
export async function sellTokenHandler(
	slippagePercent: number,
	amountInMax: BigNumberish | Typed,
	tokenOut: AddressLike,
	privateKey: string,
	RouterAddress: string,
	dexType: string,
	botRouterAddress: string,
	ctx: MyContext
) {
	const Weth = WETH;
	const amountMinOut = await getAmountOut(
		amountInMax,
		tokenOut,
		Weth,
		slippagePercent / 100,
		privateKey,
		RouterAddress,
		dexType
	);
	// console.log({ amountMinOut });
	const botRouter = await instantiateBotRouter(
		botRouterAddress,
		process.env.RPC,
		privateKey
	);
	const Erc20token = await instantiateERC20Token(
		tokenOut.toString(),
		process.env.RPC,
		privateKey
	);
	await TransactionLoading(ctx);
	await Erc20token.approve(botRouterAddress, ethers.MaxUint256);
	const userId = ctx.chat.id.toString();
	const { referrer } = await fetchNewUserById(userId);
	const referrerDetails = await fetchNewUserById(referrer.toString());
	const referrerAddress = await getWalletAddress(referrerDetails.privateKey);
	return await botRouter
		.sellToken(tokenOut, amountInMax, amountMinOut, referrerAddress)
		.then(async (res) => {
			console.log("success", { res });
			await pointsHandler(ctx, 50);
			await ctx.reply(`${process.env.SCAN_URL}${res.hash}`);
		})
		.catch(async (err) => await ParseError(ctx, err));
	//buy token
}
