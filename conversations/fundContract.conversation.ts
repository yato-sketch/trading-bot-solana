import { ethers, parseEther, parseUnits } from "ethers";
import { MyConversation } from ".";
import { MyContext } from "../bot";
import { TransactionLoading, ParseError } from "../handlers/mangeToken.handler";
import { CreateWallet, SafeToken } from "../web3";
const Wallet = new CreateWallet();
const { WalletSigner, getTransactionReciept } = Wallet;

export async function fundContractConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	await ctx.reply("Pls Enter Amount of Token To send to token Contract: ");
	let response = await conversation.waitFor(":text");
	console.log(ctx.session.walletAddress, response.msg.text);

	const tokenContract = new SafeToken(
		await WalletSigner(
			ctx.session.privateKey,
			new ethers.JsonRpcProvider(process.env.RPC)
		),
		ctx.session.walletAddress
	);
	const data = await tokenContract.tokenSecondaryDetails();
	const decimal = data[6];
	if (Number.isInteger(parseInt(response.msg.text))) {
		await TransactionLoading(ctx);
		// const unit = parseEther(ctx.msg.text);
		console.log(
			parseUnits(response.msg.text, parseInt(decimal)).toString(),
			ctx.session.walletAddress
		);
		await tokenContract
			.fundContractwithToken(
				parseUnits(response.msg.text, parseInt(decimal)).toString(),
				ctx.session.walletAddress
			)
			.then(async (res) => {
				await ctx.deleteMessage();
				await ctx.reply(
					`Contract Funded \n 🎊TxHash:🎊 \n ${process.env.SCAN_URL}${res.hash}`
				);
			})
			.catch(async (err) => {
				await ParseError(ctx, err);
			});
	} else {
		await ctx.reply("Input a Number");

		return;
	}

	//console.log({ unit });
}
