import { Bot, CommandContext, Context } from "grammy";

export async function WalletCommand(_ctx: CommandContext<Context>) {
	_ctx.reply(`My Wallet Details`);
}
