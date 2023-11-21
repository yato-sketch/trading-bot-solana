import { Menu } from "@grammyjs/menu";
import { InlineKeyboard } from "grammy";
import { MyContext } from "../bot";
import { TotalSupplyObject } from "../utils";
export const createTokenButton = () =>
	new InlineKeyboard().text("Create Token", `create-token`);
const redLight = "🔴";
const greenLight = "🟢";
export const CreateTokenMenu = new Menu<MyContext>("create-token-menu")
	.text((ctx) =>
		ctx.session.isSetTotalSupply
			? `Set Total Supply ${greenLight} :${ctx.session.totalSupply}`
			: ` Set Total Supply ${redLight} :${ctx.session.totalSupply}`
	)
	.row()
	.text("1 billion ", async (ctx) => {
		ctx.session.isSetTotalSupply = true;
		ctx.session.totalSupply = TotalSupplyObject["1 billion"];
		ctx.menu.update();
	})
	.text("1 million ", async (ctx) => {
		ctx.session.isSetTotalSupply = true;
		ctx.session.totalSupply = TotalSupplyObject["1 million"];
		ctx.menu.update();
	})
	.row()
	.text("10 million ", async (ctx) => {
		ctx.session.isSetTotalSupply = true;
		ctx.session.totalSupply = TotalSupplyObject["10 million"];

		ctx.menu.update();
	})
	.text("100 million ", async (ctx) => {
		ctx.session.isSetTotalSupply = true;
		ctx.session.totalSupply = TotalSupplyObject["100 million"];
		ctx.menu.update();
	})
	.row()
	.text("Custom  TotalSupply ", (ctx) => {
		console.log("you selected custom Total supply");
		console.log(ctx.session.totalSupply);
	})
	.row()
	.text((ctx) =>
		ctx.session.isInitTaxSet
			? "Set Initial Tax " + greenLight
			: "Set Initial Tax" + redLight
	)
	.row()
	.text("2 % ")
	.text("6 % ")
	.text("10 % ")
	.row()
	.text("Set Custom Initial Tax ")
	.row()
	.text("Set Final Tax ")
	.row()
	.text("2 % ")
	.text("6 % ")
	.text("10 % ")
	.row()
	.text("Set Custom Final Tax ")
	.row()
	.text("Set Token Symbol ")
	.row()
	.text("Set Token Name ")
	.row()
	.text("Set Marketing Wallet ")
	.row()
	.text("Set Token Decimal ")
	.row()
	.text("9")
	.text("18")
	.text("8")
	.text("10")
	.row()
	.text("Create Token");
