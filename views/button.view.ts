import { Menu } from "@grammyjs/menu";
import { InlineKeyboard } from "grammy";
import { MyContext } from "../bot";

export const DeployTokenMenu = new Menu<MyContext>("deployer-menu")
	.text("Deploy Token", (ctx) => {
		const {
			tokenName,
			tokenSymbol,
			tokendecimal,
			marketingWalletAddress,
			finTax,
			initTax,
			totalSupply,
		} = ctx.session;
		console.log({
			tokenName,
			tokenSymbol,
			tokendecimal,
			marketingWalletAddress,
			finTax,
			initTax,
			totalSupply,
		});
	})
	.row();

export const accountMenu = new InlineKeyboard()
	.text("Withdraw Eth")
	.row()
	.text("Withdraw Token");
