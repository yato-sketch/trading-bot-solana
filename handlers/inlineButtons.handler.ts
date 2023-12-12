import { Composer, Context, InlineKeyboard } from "grammy";
import { createToken } from "../views/create_token.view";
import { MyContext } from "../bot";
import { SafeToken, TokenDeployer, getWalletAddress } from "../web3";
import { CreateWallet } from "../web3";
import { setSessions } from ".";
import { ethers, formatUnits, parseEther } from "ethers";
import {
	DecimalObject,
	TotalSupplyObject,
	finalTaxObject,
	initTaxObject,
	objectModifier,
	trimAddress,
} from "../utils";
import { myState } from "../utils";
import {
	decimalMenu,
	finalTaxMenu,
	initTaxMenu,
	mangeTokenMenu,
	totalSupplyKeyBoard,
} from "../views";
import { MangeTokenHandler } from "./mangeToken.handler";
import { buyTokenHandler } from "./buyToken.handler";
import { sellTokenHandler } from "./sellToken.handler";
import { instantiateERC20Token } from "../web3/instantiate";
const Wallet = new CreateWallet();
const { WalletSigner } = Wallet;
async function goToIniTaxMenu(ctx: MyContext) {
	await ctx.deleteMessage();
	await ctx.reply(`Total Supply Set to: ${ctx.session.totalSupply} ✅`);
	await ctx.reply("Set Inital Tax ", { reply_markup: initTaxMenu });
}
async function goToFinalTax(ctx: MyContext) {
	await ctx.deleteMessage();
	await ctx.reply(`Initial Tax is Set to: ${ctx.session.initTax} ✅`);

	await ctx.reply("Set Final Tax ", { reply_markup: finalTaxMenu });
}
async function gotoDecimal(ctx: MyContext) {
	await ctx.deleteMessage();
	await ctx.reply(`Final Tax is Set to: ${ctx.session.finTax} ✅`);

	await ctx.reply("Set Token Decimal ", { reply_markup: decimalMenu });
}
async function goToSetTokenMetadata(ctx: MyContext) {
	await ctx.deleteMessage();
	await ctx.reply(`Token Decimal is Set to: ${ctx.session.tokendecimal} ✅`);
	await ctx.conversation.enter("setTokenMetadataConversation");
}
async function returnTo(title: string, menu: InlineKeyboard, ctx: MyContext) {
	await ctx.deleteMessage();
	await ctx.reply(title, { reply_markup: menu });
}
const CallBackMap: Map<string, any> = new Map();
const TotalSupplyMap: Map<string, any> = new Map();
CallBackMap.set("create-token", async (ctx: MyContext) => {
	await myState.setDefaultState(ctx.chat?.id?.toString());
	ctx.deleteMessage();
	createToken(ctx);
});
CallBackMap.set("null", async (ctx) => {
	return null;
});
TotalSupplyMap.set(
	"total-supply",
	async (ctx: MyContext, totalSupplyAmount: string) => {
		const query = totalSupplyAmount.split("|");
		if (query[1] === "custom") {
			await ctx.conversation.enter("setCustomTotalSupply");
		} else if (query[1] == "return") {
			console.log("Welcome");
		} else {
			const getUserState = await myState.getStore(
				ctx.chat?.id?.toString()
			);
			ctx.session.isSetTotalSupply = true;
			ctx.session.totalSupply = TotalSupplyObject[query[1]];
			await myState.setStore(
				ctx.chat?.id?.toString(),
				objectModifier(
					getUserState,
					"totalSupply",
					ctx.session.totalSupply
				)
			);
			goToIniTaxMenu(ctx);
		}
	}
);
TotalSupplyMap.set(
	"init-tax",
	async (ctx: MyContext, callbackquery: string) => {
		const query = callbackquery.split("|");

		if (query[1] === "custom") {
			await ctx.conversation.enter("setCustomInitTax");
		} else if (query[1] == "return") {
			//	console.log("Welcome");
			returnTo("Set Total Supply", totalSupplyKeyBoard, ctx);
		} else {
			const getUserState = await myState.getStore(
				ctx.chat?.id?.toString()
			);
			ctx.session.isSetTotalSupply = true;
			ctx.session.initTax = initTaxObject[query[1]];
			await myState.setStore(
				ctx.chat?.id?.toString(),
				objectModifier(getUserState, "initTax", ctx.session.initTax)
			);
			goToFinalTax(ctx);
		}
	}
);
TotalSupplyMap.set(
	"final-tax",
	async (ctx: MyContext, callbackquery: string) => {
		const query = callbackquery.split("|");
		if (query[1] === "custom") {
			await ctx.conversation.enter("setCustomFinalTaxConversation");
		} else if (query[1] == "return") {
			//console.log("Welcome");
			returnTo("Set Initial Tax:", initTaxMenu, ctx);
		} else {
			const getUserState = await myState.getStore(
				ctx.chat?.id?.toString()
			);
			ctx.session.isSetTotalSupply = true;
			ctx.session.finTax = finalTaxObject[query[1]];
			await myState.setStore(
				ctx.chat?.id?.toString(),
				objectModifier(getUserState, "finTax", ctx.session.finTax)
			);
			gotoDecimal(ctx);
		}
	}
);
TotalSupplyMap.set("decimal", (ctx: MyContext, callbackquery: string) => {
	const query = callbackquery.split("|");
	if (query[1] === "custom") {
		//ctx.conversation.enter("setCustomInitTax");
	} else if (query[1] == "return") {
		//console.log("Welcome");
		returnTo("Set Initial Tax:", initTaxMenu, ctx);
	} else {
		ctx.session.isSetTotalSupply = true;
		ctx.session.tokendecimal = DecimalObject[query[1]];
		goToSetTokenMetadata(ctx);
	}
});

const callBackQueryComposer = new Composer<MyContext>();
callBackQueryComposer.on("callback_query:data", async (ctx) => {
	const data = ctx.callbackQuery.data;

	await setSessions(ctx as any);

	if (data === "cancel") {
		console.log("cancel");
		await ctx.deleteMessage();
	}
	if (data.includes("buy-")) {
		const query = data.split("-");
		if (query[1].toString() !== "custom") {
			console.log("jhdfjk");
			const slippage = 10;
			const amountInMax = BigInt(parseEther(query[1]));
			const tokenOut = query[2];
			const privateKey = ctx.session.privateKey;
			const amountToBuy = query[1];
			await buyTokenHandler(
				slippage,
				amountInMax,
				tokenOut,
				privateKey,
				amountToBuy,
				ctx
			);
		} else {
			//console.log("custom");
			ctx.session.customBuyToken = query[2];
			await ctx.conversation.enter("setTradeAmountConversation");
		}
	}
	if (data.includes("sell-")) {
		const query = data.split("-");
		if (query[1].toString() !== "custom") {
			const token = query[2];
			const rpc = process.env.RPC;
			const tokenC = instantiateERC20Token(
				token,
				rpc,
				ctx.session.privateKey
			);
			const tokenBalance = await (
				await tokenC
			).balanceOf(await getWalletAddress(ctx.session.privateKey));
			const slippage = 40;
			const sellingPercent = BigInt((parseInt(query[1]) / 100) * 1000);
			const amountOut =
				BigInt(sellingPercent * tokenBalance) / BigInt(1000);
			const privateKey = ctx.session.privateKey;

			await sellTokenHandler(slippage, amountOut, token, privateKey, ctx);
		} else {
			ctx.session.customSellToken = query[2];
			const rpc = process.env.RPC;
			const tokenC = instantiateERC20Token(
				ctx.session.customSellToken,
				rpc,
				ctx.session.privateKey
			);
			const tokenBalance = await (
				await tokenC
			).balanceOf(await getWalletAddress(ctx.session.privateKey));
			ctx.session.tokenBalance = tokenBalance;
			// console.log("selling Custom");
			await ctx.conversation.enter("setSellTradeAmountConversation");
		}
	}

	await ctx.answerCallbackQuery();
});
export { callBackQueryComposer };
