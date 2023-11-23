import { Bot, CommandContext, Context } from "grammy";
import { startView } from "../views";

export async function createCommand(_ctx: CommandContext<Context>) {
	await startView(_ctx);
}
