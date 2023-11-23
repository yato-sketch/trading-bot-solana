import { CreateWallet } from "../web3";
import { Context } from "grammy";
import apiCalls from "../utils/apiCall";
import { User, WalletGenerated } from "../types";
const userDataCall = new apiCalls();
const { createUser, fetchUserByTgId } = userDataCall;
import { MyContext } from "../bot";
import { viewWalletDetailsView } from "../views";
export async function GenerateWallet(ctx: MyContext) {
	const newWallet = new CreateWallet();
	const userId = ctx.message?.from.id.toString()!;
	const userData = await fetchUserByTgId(userId);
	async function createUserDetails(ctx: Context) {
		const Wallet: WalletGenerated = await newWallet.createWallet();
		const { privateKey, mnemonic, publicKey } = Wallet;
		const newUserProps: User = {
			PrivateKey: privateKey,
			Pin: null,
			Mnemonic: mnemonic,
			tg_id: userId,
		};
		await createUser(newUserProps);
		await viewWalletDetailsView(
			ctx,
			null,
			publicKey as string,
			privateKey,
			mnemonic
		);
	}
	if (userData?.length! > 0) {
		//console.log({ userData });
		ctx.reply(
			`Welcome to ${process.env.BOT_NAME} Token deployer Bot \n 1. /wallet to  see wallet info \n 2. /create to create new tokens \n 3. /tokens see tokens that you deployed`
		);
	} else {
		await createUserDetails(ctx);
	}
}
