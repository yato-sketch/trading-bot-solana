import { Context } from "grammy";
import { CreateTokenMenu } from "./menu.view";
import { MyContext } from "../bot";

export async function createToken(ctx: MyContext) {
	ctx.reply("Create Your Token", { reply_markup: CreateTokenMenu });
}
