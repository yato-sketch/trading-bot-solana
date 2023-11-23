import { Menu } from "@grammyjs/menu";
import { InlineKeyboard } from "grammy";
import { MyContext } from "../bot";
import {
	DecimalObject,
	TotalSupplyObject,
	finalTaxObject,
	initTaxObject,
} from "../utils";
import { myState } from "../utils";

const redLight = "🔴";
const greenLight = "🟢";
async function goToIniTaxMenu(ctx: MyContext) {
	await ctx.reply(`Total Supply Set to: ${ctx.session.totalSupply} ✅`);
	await ctx.reply("Set Inital Tax ", { reply_markup: initTaxMenu });
}
async function goToFinalTax(ctx: MyContext) {
	await ctx.reply(`Initial Tax is Set to: ${ctx.session.initTax} ✅`);
	await ctx.reply("Set Final Tax ", { reply_markup: finalTaxMenu });
}
async function gotoDecimal(ctx: MyContext) {
	await ctx.reply(`Final Tax is Set to: ${ctx.session.finTax} ✅`);
	await ctx.reply("Set Token Decimal ", { reply_markup: decimalMenu });
}
async function goToSetTokenMetadata(ctx: MyContext) {
	await ctx.reply(`Token Decimal is Set to: ${ctx.session.tokendecimal} ✅`);
	await ctx.conversation.enter("setTokenMetadataConversation");
}
export const GetTotalSupplyMenu = new Menu<MyContext>("total-supply-menu")
	.text("Set Total Supply")
	.row()
	.text("1 billion ", async (ctx) => {
		ctx.session.isSetTotalSupply = true;
		ctx.session.totalSupply = TotalSupplyObject["1 billion"];
		await goToIniTaxMenu(ctx);
	})
	.text("1 million ", async (ctx) => {
		ctx.session.isSetTotalSupply = true;
		ctx.session.totalSupply = TotalSupplyObject["1 million"];
		await goToIniTaxMenu(ctx);
	})
	.row()
	.text("10 million ", async (ctx) => {
		ctx.session.isSetTotalSupply = true;
		ctx.session.totalSupply = TotalSupplyObject["10 million"];
		await goToIniTaxMenu(ctx);
	})
	.text("100 million ", async (ctx) => {
		ctx.session.isSetTotalSupply = true;
		ctx.session.totalSupply = TotalSupplyObject["100 million"];
		await goToIniTaxMenu(ctx);
	})
	.row()
	.text("Custom  TotalSupply ", async (ctx) => {
		await ctx.conversation.enter("setCustomTotalSupply");
	});

export const initTaxMenu = new Menu<MyContext>("init-tax-menu")
	.text("2 % ", async (ctx) => {
		ctx.session.isInitTaxSet = true;
		ctx.session.initTax = initTaxObject["2 %"];
		await goToFinalTax(ctx);
	})
	.text("6 % ", async (ctx) => {
		ctx.session.isInitTaxSet = true;
		ctx.session.initTax = initTaxObject["6 %"];
		await goToFinalTax(ctx);
	})
	.text("10 % ", async (ctx) => {
		ctx.session.isInitTaxSet = true;
		ctx.session.initTax = initTaxObject["10 %"];
		await goToFinalTax(ctx);
	})
	.row()
	.text(`Set Custom Initial Tax `, async (ctx) => {
		await ctx.conversation.enter("setCustomInitTax");
	})
	.row();

export const finalTaxMenu = new Menu<MyContext>("final-tax-menu")
	.text("2 % ", async (ctx) => {
		ctx.session.isFinTaxSet = true;
		ctx.session.finTax = finalTaxObject["2 %"];
		await gotoDecimal(ctx);
	})
	.text("6 % ", async (ctx) => {
		ctx.session.isFinTaxSet = true;
		ctx.session.finTax = finalTaxObject["6 %"];
		await gotoDecimal(ctx);
	})
	.text("10 % ", (ctx) => {
		ctx.session.isFinTaxSet = true;
		ctx.session.finTax = finalTaxObject["10 %"];
		gotoDecimal(ctx);
	})
	.row()
	.text("Set Custom Final Tax ", async (ctx) => {
		await ctx.conversation.enter("setCustomFinalTaxConversation");
	})
	.row();

export const decimalMenu = new Menu<MyContext>("decimal-menu")
	.text("9", async (ctx) => {
		ctx.session.tokenDecimalsSet = true;
		ctx.session.tokendecimal = DecimalObject[9];
		await goToSetTokenMetadata(ctx);
	})
	.text("18", async (ctx) => {
		ctx.session.tokenDecimalsSet = true;
		ctx.session.tokendecimal = DecimalObject[18];
		await goToSetTokenMetadata(ctx);
	})
	.text("8", async (ctx) => {
		ctx.session.tokenDecimalsSet = true;
		ctx.session.tokendecimal = DecimalObject[8];
		await goToSetTokenMetadata(ctx);
	})
	.text("10", async (ctx) => {
		ctx.session.tokenDecimalsSet = true;
		ctx.session.tokendecimal = DecimalObject[10];
		await goToSetTokenMetadata(ctx);
	})
	.row();
export const createTokenButton = () =>
	new InlineKeyboard().text("Create Token", `create-token`);

export const CreateTokenMenu = new Menu<MyContext>("create-token-menu").text(
	"Create Token"
);
