import { InlineKeyboard } from "grammy";

export const DeployTokenButton = new InlineKeyboard().text(
	"Deploy Token",
	"deploy-token"
);

export const accountMenu = new InlineKeyboard()
	.text("Withdraw Eth")
	.row()
	.text("Withdraw Token");
