import { CommandContext, Context } from "grammy";
import { boldenText, makeCopiable } from "../utils";
import { MyContext } from "../bot";
import { faqController } from "../controllers/faq.controller";

export async function faqCommand(_ctx: CommandContext<MyContext>) {
	await faqController(_ctx);
}
