import { Bot, CommandContext, Context } from "grammy";

export async function MyTokenCommand(_ctx: CommandContext<Context>) {
	_ctx.reply(`Show My Tokens`);
}
