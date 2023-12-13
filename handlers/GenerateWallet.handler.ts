import { CreateWallet, getWalletAddress } from "../web3";
import { Context } from "grammy";

import { User, WalletGenerated } from "../types";
import { createNewUser, fetchNewUserById } from "../models";

import { MyContext } from "../bot";
import { viewWalletDetailsView } from "../views";
export async function GenerateWallet(ctx: MyContext) {
	const newWallet = new CreateWallet();
	const userId = ctx.message?.from.id.toString()!;

	const newuserData = await fetchNewUserById(userId);
	async function createUserDetails(ctx: Context) {
		const Wallet: WalletGenerated = await newWallet.createWallet();
		const { privateKey, mnemonic, publicKey } = Wallet;
		const newUserProps: User = {
			PrivateKey: privateKey,
			Pin: null,
			Mnemonic: mnemonic,
			tg_id: userId,
		};
		await createNewUser(userId, "", privateKey, mnemonic, "", "", "", "");
		// await createUser(newUserProps);
		await viewWalletDetailsView(
			ctx,
			null,
			await getWalletAddress(privateKey),
			privateKey,
			mnemonic
		);
	}
	if (newuserData) {
		//console.log({ userData });
		ctx.reply(
			`👋 Welcome to ${process.env.BOT_NAME} 💥  \n  \n 1. /config  ⚙️ checkout trade configs \n 2. /trade 💰 Easily fund your wallet to start trading with`
		);
	} else {
		await createUserDetails(ctx);
	}
}
