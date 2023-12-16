import { Context } from "grammy";

import { MyContext } from "../bot";

export async function createToken(ctx: MyContext) {
	ctx.reply("Create Your Token");
}
