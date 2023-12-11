import { Bot, CommandContext, Context } from "grammy";
import { createView } from "../views";

export async function ordersCommmand(_ctx: CommandContext<Context>) {
	_ctx.reply("show my trades");
}
