import { MyContext } from "../bot";
import { fetchNewUserById } from "../models";
import { boldenText, makeCopiable } from "../utils";
import { accountMenu } from "../views";
import { getWalletAddress } from "../web3";
import { CreateWallet } from "../web3";

const Wallet = new CreateWallet();
export async function walletController(ctx: MyContext) {
	let walletAddress, EthBalance, usdtBalance, mnemonic;
	const userDetails = await fetchNewUserById(ctx.chat.id.toString());
	if (userDetails) {
		const pK = userDetails.privateKey;
		mnemonic = userDetails.mnemonic;
		const { referralCount, points } = userDetails;
		const pubK = await getWalletAddress(pK);
		console.log({ pubK });
		const EthBalance = await Wallet.EthBalance(pubK);
		const refLink = `https://t.me/${process.env.BOT_USER_NAME}?start=${userDetails.tgId}`;

		ctx.session.privateKey = pK;
		ctx.session.walletAddress = pubK;

		ctx.reply(
			`💳 ${process.env.BOT_NAME} ACCOUNT DETAILS \n \n🚧 ${boldenText(
				"THESE DETAILS MUST BE KEPT PRIVATE"
			)} 🚧\n \n🔐 PrivateKey:\n ${boldenText(
				makeCopiable(pK)
			)}  \n \n🌐 WalletAddress:\n  ${makeCopiable(
				pubK
			)} \n🔡 Mnemonic:\n ${makeCopiable(
				mnemonic
			)}\n  \n💰 FTM BALANCE:\n ${EthBalance} \n \nYour Referral Link: ${refLink} \nNumber of Referrals: ${referralCount} \nBullets: ${points}  \n \n`,
			{ reply_markup: accountMenu, parse_mode: "HTML" }
		);
	} else {
		ctx.reply("User Data Not Found");
	}
}
