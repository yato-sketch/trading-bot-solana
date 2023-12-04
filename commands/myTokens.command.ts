import { Bot, CommandContext, Context } from "grammy";
import { showDeployedTokenHandler } from "../handlers/showDeployedTokens";
import { MyContext } from "../bot";

export async function MyTokenCommand(_ctx: CommandContext<MyContext>) {
	_ctx.reply(`Show My Tokens`);
	await showDeployedTokenHandler(_ctx);
}
