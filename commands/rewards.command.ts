import { CommandContext } from "grammy";
import { MyContext } from "../bot";
import { rewardsController } from "../controllers/rewards.controller";
export async function rewardsCommand(_ctx: CommandContext<MyContext>) {
	await rewardsController(_ctx);
}
