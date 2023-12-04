import { InlineKeyboard } from "grammy";
import { MyContext } from "../bot";
import { TokenDeployedGraph } from "../types";
import { trimAddress } from "../utils";

export async function renderFromTo(
	ctx: MyContext,
	from: number,
	to: number,
	data: TokenDeployedGraph[]
) {
	if (data.length === to + 1) {
		const depTokensMenu = new InlineKeyboard();
		for (let index = from; index < to; index++) {
			const element = data[index];
			depTokensMenu
				.text(`Token Name:${element.tokenName}`)
				.row()
				.text(`Total Supply:${element.totalSupply}`)
				.row()
				.text(
					`Contract Address: ${trimAddress(element.deployedAddress)}`
				)
				.row()
				.text("Mange Token", `mange-token-${element.deployedAddress}`)
				.row();
		}
		await ctx.reply("Your List of Deployed Tokens", {
			reply_markup: depTokensMenu,
		});
	} else {
		const depTokensMenu = new InlineKeyboard();
		for (let index = from; index < to; index++) {
			const element = data[index];
			depTokensMenu
				.text(`Token Name:${element.tokenName}`)
				.row()
				.text(`Total Supply:${element.totalSupply}`)
				.row()
				.text(
					`Contract Address: ${trimAddress(element.deployedAddress)}`
				)
				.row()
				.text("Mange Token", `mange-token-${element.deployedAddress}`)
				.row();
		}
		if (data.length === to + 1) {
			depTokensMenu.text("Prev Page", `prev-page-${data.length - 3}`);
		} else if (from === 0) {
			depTokensMenu.text("Next Page", `next-page-${to + 1}`);
		} else {
			depTokensMenu
				.text("Prev Page", `prev-page-${from - 3}`)
				.text("Next Page", `next-page-${to + 1}`);
		}

		await ctx.reply("Your List of Deployed Tokens", {
			reply_markup: depTokensMenu,
		});
	}
}
