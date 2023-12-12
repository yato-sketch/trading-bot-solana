import { BigNumberish, Typed, AddressLike, parseEther, ethers } from "ethers";
import {
	instantiateBotRouter,
	instantiateDexRouter,
	instantiateERC20Token,
} from "../web3/instantiate";
import { BotRouter, WETH, spookyDexRouter } from ".";
import { MyContext } from "../bot";
import { ParseError, TransactionLoading } from "./mangeToken.handler";

async function getAmountOut(
	amountInMax: BigNumberish | Typed,
	tokenIn: AddressLike,
	tokenOut: AddressLike,
	Slippage: number,
	privateKey: string
) {
	const dexRouterContract = await instantiateDexRouter(
		spookyDexRouter,
		process.env.RPC,
		privateKey
	);

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
export async function sellTokenHandler(
	slippagePercent: number,
	amountInMax: BigNumberish | Typed,
	tokenOut: AddressLike,
	privateKey: string,
	ctx: MyContext
) {
	const Weth = WETH;
	const amountMinOut = await getAmountOut(
		amountInMax,
		tokenOut,
		Weth,
		slippagePercent / 100,
		privateKey
	);
	// console.log({ amountMinOut });
	const botRouter = await instantiateBotRouter(
		BotRouter,
		process.env.RPC,
		privateKey
	);
	const Erc20token = await instantiateERC20Token(
		tokenOut.toString(),
		process.env.RPC,
		privateKey
	);
	await TransactionLoading(ctx);
	await Erc20token.approve(BotRouter, ethers.MaxUint256);
	return await botRouter
		.sellToken(tokenOut, amountInMax, amountMinOut)
		.then(async (res) => {
			console.log("success", { res });
			await ctx.reply(`${process.env.SCAN_URL}${res.hash}`);
		})
		.catch(async (err) => await ParseError(ctx, err));
	//buy token
}
