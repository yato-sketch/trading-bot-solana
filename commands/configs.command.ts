import { Bot, CommandContext, Context } from "grammy";
import { showDeployedTokenHandler } from "../handlers/showDeployedTokens";
import { MyContext } from "../bot";
import { settingMenu } from "../views";
import { configContoller } from "../controllers/config.controller";

export async function configsCommand(_ctx: CommandContext<MyContext>) {
	await configContoller(_ctx);
}
