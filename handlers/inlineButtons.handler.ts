import { Composer, Context } from "grammy";
import { createToken } from "../views/create_token.view";
import { MyContext } from "../bot";
const CallBackMap: Map<string, any> = new Map();
CallBackMap.set("create-token", (ctx: MyContext) => {
	ctx.deleteMessage();
	createToken(ctx);
});
const callBackQueryComposer = new Composer();
callBackQueryComposer.on("callback_query:data", async (ctx) => {
	const data = ctx.callbackQuery.data;
	//console.log({ data });
	CallBackMap.get("create-token")(ctx);
	await ctx.answerCallbackQuery();
});
export { callBackQueryComposer };
