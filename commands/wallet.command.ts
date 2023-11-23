import { Bot, CommandContext, Context } from "grammy";
import apiCalls from "../utils/apiCall";
import { getWalletAddress } from "../web3";
import { CreateWallet } from "../web3";
import { MyContext } from "../bot";
import { ethers } from "ethers";
import { accountMenu } from "../views";
const accountCall = new apiCalls();
const Wallet = new CreateWallet();

export async function WalletCommand(ctx: CommandContext<MyContext>) {
	let walletAddress, EthBalance, usdtBalance, mnemonic;
	const userDetails = await accountCall.fetchUserByTgId(
		ctx.chat.id.toString()
	);
	if (userDetails) {
		const pK = userDetails[0].PrivateKey;
		mnemonic = userDetails[0].Mnemonic;
		const pubK = await getWalletAddress(pK);
		console.log({ pubK });
		const EthBalance = await Wallet.EthBalance(pubK);

		ctx.session.privateKey = pK;
		ctx.session.walletAddress = pubK;
		ctx.reply(
			`${process.env.BOT_NAME} Account DETAILS \n \n  THESE DETAILS MUST BE KEPT PRIVATE \n \n privateKey:\n ${pK} \n \n WalletAddress:\n  ${pubK} \n Mnemonic:\n ${mnemonic}\n \n   ETH BALANCE:\n ${EthBalance} \n \n`,
			{ reply_markup: accountMenu }
		);
	} else {
		ctx.reply("User Data Not Found");
	}
}
