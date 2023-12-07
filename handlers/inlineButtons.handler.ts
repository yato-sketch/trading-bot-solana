import { Composer, Context, InlineKeyboard } from "grammy";
import { createToken } from "../views/create_token.view";
import { MyContext } from "../bot";
import { SafeToken, TokenDeployer } from "../web3";
import { CreateWallet } from "../web3";
import { setSessions } from ".";
import { ethers } from "ethers";
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
			ctx.conversation.enter("setCustomTotalSupply");
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
			ctx.conversation.enter("setCustomInitTax");
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
			ctx.conversation.enter("setCustomFinalTaxConversation");
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
	const totalSupplyQuery = data.split("|")[0];

	await setSessions(ctx as any);
	//	console.log(ctx.chat.id);
	// if (data === "deploy-token") {
	// }
	console.log(data);
	if (data === "create-token") {
		CallBackMap.get(data)(ctx);
	}

	if (totalSupplyQuery !== "create-token") {
		if (data.split("-")[0] === "manage") {
			ctx.deleteMessage();
			const address = data.split("|")[1].split("!")[0];
			const symbol = data.split("!")[1];
			console.log("herer", { address, symbol });
			const tokenContract = new SafeToken(
				await WalletSigner(
					ctx.session.privateKey,
					new ethers.JsonRpcProvider(process.env.RPC)
				),
				address
			);
			const add = await tokenContract.tokenSecondaryDetails();
			const buyTax = add[4];
			const sellTax = add[5];
			if (buyTax && sellTax && address) {
				await ctx.reply(
					`🔨 Manage ${symbol} Token \n \n Sell Tax: ${sellTax} \n Buy Tax: ${buyTax}  \n \n Instruction on Open Trading: \n \n 1.) Send Amount of ETH to Token Contract (${trimAddress(
						address
					)})  for Liquidity \n \n 2.) Send to the token contract address the amount of ${symbol} to add for liquidity \n \n  3.) Click on open Trading to add liquidity  `,
					{
						reply_markup: mangeTokenMenu(address),
					}
				);
			}
		} else if (data.split("#")[0] === "m") {
			const managerData = data.split("#")[1];
			console.log({ managerData });
			MangeTokenHandler.get(managerData.split("|")[0])(
				ctx as any,
				managerData.split("|")[1]
			);
			console.log("energy");
		} else {
			TotalSupplyMap.get(totalSupplyQuery)(ctx, data);
		}
	}

	await ctx.answerCallbackQuery();
});
export { callBackQueryComposer };
