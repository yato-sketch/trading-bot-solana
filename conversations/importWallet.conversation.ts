import { Wallet, ethers } from "ethers";
import { MyConversation } from ".";
import { MyContext } from "../bot";
import { fetchNewUserById, updateUser } from "../models";

function verify(value: string) {
	try {
		new Wallet(value);
	} catch (e) {
		return false;
	}
	return true;
}
export async function importWalletConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	const userId = ctx.chat.id.toString();
	const userData = await fetchNewUserById(userId);
	await ctx.reply(
		`Pls kindly Enter Private Key: \n \nNote: Wallet Imported Will replace Exist Wallet \n Pls Save`
	);
	let seedPhrase = await conversation.waitFor(":text");

	const isValidKey = verify(seedPhrase.message.text);
	if (isValidKey) {
		//const wallet = new ethers.entropyß
		//const mnemonic = wallet;
		await updateUser(ctx.chat.id.toString(), {
			privateKey: seedPhrase.msg.text.toString(),
		})
			.then((res) => {
				ctx.reply("New Wallet Imported");
			})
			.catch((err) => {
				console.log("error Occrued");
			});
	} else {
		await ctx.deleteMessage();
		await ctx.reply("Invalid Private Key. pls Try Again");
	}

	//check for space
}
