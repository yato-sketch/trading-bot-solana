import { CommandContext } from "grammy";
import { GenerateWallet } from "../handlers";
import { MyContext } from "../bot";
import { referringHandler } from "../handlers/referrer.handler";
export async function startCommand(_ctx: CommandContext<MyContext>) {
	await GenerateWallet(_ctx);
	const m = _ctx.match;
	if (m && m != _ctx.chat.id.toString()) {
		console.log({ m });
		await referringHandler(_ctx, parseInt(m));
	}
}
