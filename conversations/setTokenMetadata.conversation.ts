import { ethers, isAddress } from "ethers";
import { MyConversation } from ".";
import { MyContext } from "../bot";
import { finalTaxMenu, DeployTokenMenu, confirmationMenu } from "../views";
import { CreateWallet, TokenDeployer } from "../web3";
import { callBackQueryComposer, setSessions } from "../handlers";
import { myState } from "../utils";
import { ParseError, TransactionLoading } from "../handlers/mangeToken.handler";
import { sleep, verifyContractCode } from "../web3/contracts-handler";

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
	await ctx.reply("Enter Token Telegram group of Channel: (must be links) ");
	let grouplink = (await conversation.waitFor("::url")).msg.text;
	await ctx.reply(
		`${responseName.msg.text} token Telegram group is ${grouplink}`
	);
	await ctx.reply("Enter Token Webiste Link: (must be links) ");
	let webSiteLink = (await conversation.waitFor("::url")).msg.text;
	await ctx.reply(`${responseName.msg.text} token weblink is ${webSiteLink}`);
	console.log(
		ctx.chat?.id?.toString(),
		"final total",
		myState.getStore(ctx.chat?.id?.toString())
	);

	await setSessions(ctx);
	const Wallet = new CreateWallet();
	const { WalletSigner, getTransactionReciept } = Wallet;
	const tokendeployer = new TokenDeployer(
		await WalletSigner(
			ctx.session.privateKey,
			new ethers.JsonRpcProvider(process.env.RPC)
		)
	);
	const tokenGroupLink = "";
	let deployerUsername = responseMarketWallet.msg.from.username;
	let deployerId = responseName.msg.from.id;
	// token name
	// token Id
	//contract address
	//tax
	// max Transaction
	//max wallet size
	const mainState = await myState.getStore(ctx.chat?.id?.toString());
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
		mainState.totalSupply.toString() &&
		mainState.initTax &&
		mainState.finTax &&
		tokenName &&
		tokenSymbol &&
		tokendecimal &&
		marketingWalletAddress
	) {
		// await ctx.reply(
		// 	` Token Details :\n \n  🆔 Deployer Username: @${deployerUsername}  \n \n 🆔 Deployer Id: ${deployerId} \n \n 🔠 Token Name: ${tokenName} \n \n  ➗Initial Tax: ${mainState.initTax} % \n \n  ➗Final Tax: ${mainState.finTax} % \n \n 🆔 Telegram Link: ${grouplink} \n \n WebsiteLink:${webSiteLink} \n \n 💰TotalSupply: ${mainState.totalSupply} ${tokenSymbol} \n \n Token Decimal: ${tokendecimal} `
		// );
		// callBackQueryComposer.on("msg:text", async (ctx: MyContext, next) => {
		// 	console.log(ctx.msg.text);
		// 	//await next();
		// 	if (ctx.msg.text === "1") {
		// 		await ctx.reply("here");
		// 		await next();
		// 	} else {
		// 		await ctx.reply("no be here");
		// 		await next();
		// 	}
		// });

		await TransactionLoading(ctx);
		await tokendeployer
			.deployNewToken(
				mainState.totalSupply.toString(),
				mainState.initTax,
				mainState.initTax,
				tokenSymbol,
				tokenName,
				marketingWalletAddress,
				tokendecimal,
				mainState.finTax,
				mainState.finTax
			)
			.then(async (res) => {
				//console.log({ res });
				console.log("processing \n ======>\n");
				if (res) {
					ctx.reply(
						`🎉🎉🎉Token deployed 🎉🎉🎉🎉🎉🎉 \n
						🎊TxHash:🎊 \n ${process.env.SCAN_URL}${res.hash}`
					);
				}
				await ctx.api.sendMessage(
					process.env.CHANNEL_ID,
					`Token Details:\n \n  🆔 Deployer Username: @${deployerUsername} \n \n  Token Deployment Hash: ${process.env.SCAN_URL}${res.hash}  \n \n 🆔 Deployer Id: ${deployerId} \n \n 🔠 Token Name: ${tokenName} \n \n  ➗Initial Tax: ${mainState.initTax} % \n \n  ➗Final Tax: ${mainState.finTax} % \n \n 🆔 Telegram Link: ${grouplink} \n \n WebsiteLink:${webSiteLink} \n \n 💰TotalSupply: ${mainState.totalSupply} ${tokenSymbol} \n \n Token Decimal: ${tokendecimal} `
				);
				// await sleep(6000);
				// const reciept = await getTransactionReciept(
				// 	res.hash,
				// 	new ethers.JsonRpcProvider(process.env.RPC)
				// );
				// console.log({ reciept });
				//verifyContractCode();
				return res;
			})
			.then((res) => {
				console.log("done");
				console.log({ res });
			})
			.catch((err) => {
				console.log(err);
				ParseError(ctx, err);
				//ctx.reply(`Token Deployment Error`);
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
		ctx.reply(
			`BOT ERROR: ❌ ❌  Could Not Set Token Config\n ❌ ❌  Due to incomplete Token Data\n  ⚠️Kindly Try Again`
		);
	}
}
