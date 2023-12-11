import { BigNumberish, Typed, AddressLike } from "ethers";
import {
	instantiateBotRouter,
	instantiateDexRouter,
} from "../web3/instantiate";
import { BotRouter, WETH, spookyDexRouter } from ".";

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
export async function buyTokenHandler(
	slippagePercent: number,
	amountInMax: BigNumberish | Typed,
	tokenOut: AddressLike,
	privateKey: string
) {
	//calculate slippage
	const Weth = WETH;
	const amountMinOut = await getAmountOut(
		amountInMax,
		Weth,
		tokenOut,
		slippagePercent,
		privateKey
	);
	const botRouter = await instantiateBotRouter(
		BotRouter,
		process.env.RPC,
		privateKey
	);
	return await botRouter.buyToken(tokenOut, amountMinOut);
	//buy token
}
