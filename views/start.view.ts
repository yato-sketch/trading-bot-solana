import { Context } from "grammy";
import { createTokenButton } from "./menu.view";
export async function startView(ctx: Context) {
	await ctx.reply("Welcome to this Token Deployer Bot", {
		reply_markup: createTokenButton(),
	});
}
