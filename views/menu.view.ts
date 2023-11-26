import { Menu } from "@grammyjs/menu";
import { InlineKeyboard } from "grammy";
import { MyContext } from "../bot";
import {
	DecimalObject,
	TotalSupplyObject,
	finalTaxObject,
	initTaxObject,
} from "../utils";
import { Composer } from "grammy";
import { myState } from "../utils";
import { DeployTokenMenu } from "./button.view";

const menuComposer = new Composer();

const redLight = "🔴";
const greenLight = "🟢";
async function goToIniTaxMenu(ctx: MyContext) {
	await ctx.reply(`Total Supply Set to: ${ctx.session.totalSupply} ✅`);
	await ctx.reply("Set Inital Tax ", { reply_markup: initTaxMenu });
}

async function gotoDecimal(ctx: MyContext) {
	await ctx.reply(`Final Tax is Set to: ${ctx.session.finTax} ✅`);
	await ctx.reply("Set Token Decimal ", { reply_markup: decimalMenu });
}
async function goToSetTokenMetadata(ctx: MyContext) {
	await ctx.reply(`Token Decimal is Set to: ${ctx.session.tokendecimal} ✅`);
	await ctx.conversation.enter("setTokenMetadataConversation");
}
export const totalSupplyKeyBoard = new InlineKeyboard()
	.text("Set Total Supply")
	.row()
	.text("1 billion", "total-supply|1-billion")
	.text("1 million", "total-supply|1-million")
	.row()
	.text("10 million", "total-supply|10-million")
	.text("100 million", "total-supply|100-million")
	.row()
	.text("Custom  TotalSupply", "total-supply|custom")
	.row();

export const initTaxMenu = new InlineKeyboard()
	.text("2 %", "init-tax|2-%")
	.text("6 % ", "init-tax|6-%")
	.text("10 % ", "init-tax|10-%")
	.row()
	.text(`Set Custom Initial Tax `, "init-tax|custom")
	.row()
	.text("return", "init-tax|return");

export const finalTaxMenu = new InlineKeyboard()
	.text("2 %", "final-tax|2-%")
	.text("6 % ", "final-tax|6-%")
	.text("10 % ", "final-tax|10-%")
	.row()
	.text(`Set Custom Initial Tax `, "final-tax|custom")
	.row()
	.text("return", "final-tax|return");

export const decimalMenu = new InlineKeyboard()
	.text("9", "decimal|9")
	.text("18", "decimal|18")
	.text("8", "decimal|8")
	.text("10", "decimal|10")
	.row()
	.text("return", "decimal|return");
export const mainReturn = new InlineKeyboard().text("return", "main-return");
export const confirmationMenu = new InlineKeyboard()
	.text("Start Over", "start-over")
	.row()
	.text("Return", "end-return")
	.row()
	.text("Continue", "continue")
	.row();
export const createTokenButton = () =>
	new InlineKeyboard().text("Create Token", `create-token`);

export const CreateTokenMenu = new Menu<MyContext>("create-token-menu").text(
	"Create Token"
);

export { menuComposer };
