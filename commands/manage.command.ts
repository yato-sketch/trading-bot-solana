import { Bot, CommandContext, Context } from "grammy";

export async function ManageCommand(_ctx: CommandContext<Context>) {
	_ctx.reply(`Manage My Tokens`);
}
