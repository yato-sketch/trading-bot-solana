import { ethers, isAddress } from "ethers";
import { MyConversation } from ".";
import { MyContext } from "../bot";
import { finalTaxMenu, DeployTokenMenu } from "../views";
import { CreateWallet, TokenDeployer } from "../web3";
import { setSessions } from "../handlers";

export async function setTokenMetadataConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	await ctx.reply("Set Token Symbol: ");
	let responseSymbol = await conversation.waitFor(":text");
	if (!responseSymbol.msg.text) {
		ctx.reply("Invalid Symbol 🟥 \n Kindly Input a Valid Symbol:");
		responseSymbol = await conversation.waitFor(":text");
	}
	ctx.session.tokenSymbol = responseSymbol.msg.text.toString();
	await ctx.reply("Set Token Name : ");
	let responseName = await conversation.waitFor(":text");
	if (!responseName.msg.text) {
		ctx.reply("Invalid Name 🟥 \n Kindly Input a Valid Symbol:");
		responseName = await conversation.waitFor(":text");
	}
	ctx.session.tokenName = responseName.msg.text.toString();

	await ctx.reply("Set Maketing Wallet Address: ");
	let responseMarketWallet = await conversation.waitFor(":text");
	if (
		!responseMarketWallet.msg.text ||
		isAddress(responseMarketWallet.msg.text.toString())
	) {
		ctx.reply("Invalid Address 🟥 \n Kindly input a valid Address:");
		responseMarketWallet = await conversation.waitFor(":text");
	}
	ctx.session.marketingWalletAddress =
		responseMarketWallet.msg.text.toString();

	await setSessions(ctx);
	const Wallet = new CreateWallet();
	const { WalletSigner } = Wallet;
	const tokendeployer = new TokenDeployer(
		await WalletSigner(
			ctx.session.privateKey,
			new ethers.JsonRpcProvider(process.env.RPC)
		)
	);
	const {
		totalSupply,
		initTax,
		finTax,
		tokenName,
		tokenSymbol,
		tokendecimal,
		marketingWalletAddress,
	} = ctx.session;
	if (
		totalSupply &&
		initTax &&
		finTax &&
		tokenName &&
		tokenSymbol &&
		tokendecimal &&
		marketingWalletAddress
	) {
		ctx.reply("Transaction is already is submitted. \n Loading");
		await tokendeployer
			.deployNewToken(
				totalSupply.toString(),
				initTax,
				initTax,
				tokenSymbol,
				tokenName,
				marketingWalletAddress,
				tokendecimal,
				finTax,
				finTax
			)
			.then((res) => {
				console.log({ res });

				ctx.reply(
					`Token deployed \n TxHash: https://goerli.etherscan.io/tx/${res.hash}`
				);
			})
			.catch((err) => {
				console.log(err);
				ctx.reply(`Token Deployment Error`);
			});
	} else {
		console.log({
			totalSupply,
			initTax,
			finTax,
			tokenName,
			tokenSymbol,
			tokendecimal,
			marketingWalletAddress,
		});
		ctx.reply(`BOT ERROR: Could Not Set Token Config  pls try Again`);
	}
}
