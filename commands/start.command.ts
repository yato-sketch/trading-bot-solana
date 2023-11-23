import { CommandContext } from "grammy";
import { GenerateWallet } from "../handlers";
import { MyContext } from "../bot";
export async function startCommand(_ctx: CommandContext<MyContext>) {
	GenerateWallet(_ctx);
}
