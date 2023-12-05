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

export const accountMenu = new Menu<MyContext>("withdraw menu").text(
	"Withdraw Eth",
	(ctx) => {
		ctx.conversation.enter("withdrawEthConversation");
	}
);
export const mangeTokenMenu = (addy: string) =>
	new InlineKeyboard()
		.text("Set Final Tax", "m#set-final-tax" + `|${addy}`)
		.row()
		.text("Renounce Ownership", "m#renounce-token" + `|${addy}`)
		.row()
		.text("Manual Swap", "m#manual-swap" + `|${addy}`)
		.row()
		.text("Remove Limits", "m#remove-limits" + `|${addy}`)
		.row()
		.text("Open Trading", "m#open-trading" + `|${addy}`);
