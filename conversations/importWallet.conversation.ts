import { MyConversation } from ".";
import { MyContext } from "../bot";
import { fetchNewUserById } from "../models";

export async function importWalletConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	const userId = ctx.chat.id.toString();
	const userData = await fetchNewUserById(userId);
	await ctx.reply(
		`Pls kindly Enter Private Key or Mnemonic: \nWallet Imported Will replace Exist Wallet \n Pls Save`
	);
	let seedPhrase = await conversation.waitFor(":text");
	//check for space
}
