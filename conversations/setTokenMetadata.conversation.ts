import { isAddress } from "ethers";
import { MyConversation } from ".";
import { MyContext } from "../bot";
import { finalTaxMenu, DeployTokenButton } from "../views";

export async function setTokenMetadataConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	ctx.reply("Set Token Symbol: ");
	let responseSymbol = await conversation.waitFor(":text");
	if (!responseSymbol.msg.text) {
		ctx.deleteMessage();
		ctx.reply("Invalid Symbol 🟥 \n Kindly Input a Valid Symbol:");
		responseSymbol = await conversation.waitFor(":text");
		ctx.deleteMessage();
	}
	ctx.session.tokenSymbol = responseSymbol.msg.text.toString();
	ctx.reply("Set Token Name : ");
	let responseName = await conversation.waitFor(":text");
	if (!responseName.msg.text) {
		ctx.deleteMessage();
		ctx.reply("Invalid Name 🟥 \n Kindly Input a Valid Symbol:");
		responseName = await conversation.waitFor(":text");
		ctx.deleteMessage();
	}
	ctx.session.tokenName = responseName.msg.text.toString();

	ctx.reply("Set Maketing Wallet Address: ");
	let responseMarketWallet = await conversation.waitFor(":text");
	if (
		!responseMarketWallet.msg.text ||
		isAddress(responseMarketWallet.msg.text.toString())
	) {
		ctx.deleteMessage();
		ctx.reply("Invalid Address 🟥 \n Kindly input a valid Address:");
		responseMarketWallet = await conversation.waitFor(":text");
		ctx.deleteMessage();
	}
	ctx.session.marketingWalletAddress =
		responseMarketWallet.msg.text.toString();

	const {
		tokenName,
		tokenSymbol,
		tokendecimal,
		marketingWalletAddress,
		finTax,
		initTax,
		totalSupply,
	} = ctx.session;
	ctx.reply(
		`Token Name: ${tokenName} \n Contract Address: \n Buy Tax:${initTax} \n Sell Tax:${initTax} \n Token Decimals:${tokendecimal}\n final tax:${finTax} \n Total Supply:${totalSupply} \n  Deployer Wallet Address::\n Marketing Address:\n`,
		{ reply_markup: DeployTokenButton }
	);
}
