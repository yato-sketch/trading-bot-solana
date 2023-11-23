import { Bot, CommandContext, Context } from "grammy";
import { createView } from "../views";

export async function createCommand(_ctx: CommandContext<Context>) {
	await createView(_ctx);
}
