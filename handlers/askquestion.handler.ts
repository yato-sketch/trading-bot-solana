import { MyContext } from "../bot";
import { callBackQueryComposer } from "./inlineButtons.handler";
export async function askQuestion(ctx: MyContext, question: string) {
	await ctx.deleteMessage();
	await ctx
		.reply(question, {
			reply_markup: {
				force_reply: true,
			},
		})
		.then(async (res) => {
			if (ctx.msg.text) {
				console.log(ctx.message.text);
			}
		});
}
