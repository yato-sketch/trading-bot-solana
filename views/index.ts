import { Context } from "grammy";
import { boldenText, makeCopiable } from "../utils";

export * from "./menu.view";
export * from "./start.view";
export * from "./menu.view";
export * from "./button.view";

export async function viewWalletDetailsView(
	ctx: Context,
	buttonAction: any,
	publicKey: string,
	privateKey: string,
	mnemonic: string
) {
	ctx.reply(
		`🔒${boldenText(
			" New Encrypted Fantom Wallet Created"
		)}.🔒\n   \n 💳 Wallet Address:\n ${makeCopiable(
			publicKey
		)}\n  \n 🔑 Private Key:\n${makeCopiable(
			privateKey
		)} \n🔍Mnemonic Phrase:\n${makeCopiable(
			mnemonic
		)} \n \n \n \n It is important to retain these details if you wish to access your wallet from outside this telegram account in the future, however, if these details are compromised it will grant full access to your wallet and funds. \n \n \n ---------------------------------------------\n**Store these details securely offline and then delete this message.**\n---------------------------------------------`,
		{ parse_mode: "HTML" }
	);
}
