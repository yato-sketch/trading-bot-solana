import { Bot, CommandContext, Context } from "grammy";
import { createView } from "../views";
import { balancesController } from "../controllers/balances.controller";
import { MyContext } from "../bot";
import { setSessions } from "../handlers";
export async function ordersCommmand(_ctx: CommandContext<Context>) {
	await setSessions(_ctx as MyContext);
	await balancesController(_ctx as MyContext);
}
