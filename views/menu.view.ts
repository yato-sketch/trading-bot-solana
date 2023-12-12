import { Menu } from "@grammyjs/menu";
import { InlineKeyboard } from "grammy";
import { MyContext } from "../bot";
import {
	DecimalObject,
	TotalSupplyObject,
	finalTaxObject,
	initTaxObject,
} from "../utils";
import { Composer } from "grammy";
import { myState } from "../utils";
import { DeployTokenMenu } from "./button.view";
import { configContoller } from "../controllers/config.controller";
import { updateUser } from "../models";
import { setSessions } from "../handlers";
import { tradepanelContoller } from "../controllers/tradePanel.controller";
import { balancesController } from "../controllers/balances.controller";
import { buyTokenController } from "../controllers/buyToken.controller";

const menuComposer = new Composer();

const redLight = "🔴";
const greenLight = "🟢";
async function goToIniTaxMenu(ctx: MyContext) {
	await ctx.reply(`Total Supply Set to: ${ctx.session.totalSupply} ✅`);
	await ctx.reply("Set Inital Tax ", { reply_markup: initTaxMenu });
}

async function gotoDecimal(ctx: MyContext) {
	await ctx.reply(`Final Tax is Set to: ${ctx.session.finTax} ✅`);
	await ctx.reply("Set Token Decimal ", { reply_markup: decimalMenu });
}
async function goToSetTokenMetadata(ctx: MyContext) {
	await ctx.reply(`Token Decimal is Set to: ${ctx.session.tokendecimal} ✅`);
	await ctx.conversation.enter("setTokenMetadataConversation");
}
export const totalSupplyKeyBoard = new InlineKeyboard()
	.text("Set Total Supply")
	.row()
	.text("1 billion", "total-supply|1-billion")
	.text("1 million", "total-supply|1-million")
	.row()
	.text("10 million", "total-supply|10-million")
	.text("100 million", "total-supply|100-million")
	.row()
	.text("Custom  TotalSupply", "total-supply|custom")
	.row();

export const initTaxMenu = new InlineKeyboard()
	.text("2 %", "init-tax|2-%")
	.text("6 % ", "init-tax|6-%")
	.text("10 % ", "init-tax|10-%")
	.row()
	.text(`Set Custom Initial Tax `, "init-tax|custom")
	.row()
	.text("return", "init-tax|return");

export const finalTaxMenu = new InlineKeyboard()
	.text("2 %", "final-tax|2-%")
	.text("6 % ", "final-tax|6-%")
	.text("10 % ", "final-tax|10-%")
	.row()
	.text(`Set Custom Final Tax `, "final-tax|custom")
	.row()
	.text("return", "final-tax|return");

export const decimalMenu = new InlineKeyboard()
	.text("9", "decimal|9")
	.text("18", "decimal|18")
	.text("8", "decimal|8")
	.text("10", "decimal|10")
	.row()
	.text("return", "decimal|return");
export const mainReturn = new InlineKeyboard().text("return", "main-return");
export const confirmationMenu = new InlineKeyboard()
	.text("Start Over", "start-over")
	.row()
	.text("Return", "end-return")
	.row()
	.text("Continue", "continue")
	.row();
export const createTokenButton = () =>
	new InlineKeyboard().text("Create Token", `create-token`);

export const CreateTokenMenu = new Menu<MyContext>("create-token-menu").text(
	"Create Token"
);

const viewPageNavigatorList = [["first "], ["previous "], ["next "], ["last"]];
export const viewPageNavigator = () => {
	const keyboard = new InlineKeyboard();
	for (let index = 0; index < viewPageNavigatorList.length; index++) {
		const text = viewPageNavigatorList[index][0];
		const key = viewPageNavigatorList[index][0];
		keyboard.text(`${text} page`, `page-nav-${key}`);
	}

	return keyboard;
};

export const settingMenu = new Menu<MyContext>("setting-menu")
	.text("== General Setting==")
	.row()
	.text(
		async (ctx) => {
			return ctx.session.notification
				? " 🔔 Notification"
				: "🔕 Notification";
		},
		async (ctx) => {
			ctx.session.notification = !ctx.session.notification;
			ctx.menu.update();
		}
	)
	.row()
	.text("=== AUTO BUY ==")
	.row()
	.text(
		async (ctx) =>
			ctx.session.autoBuy
				? `${greenLight} Enabled`
				: `${redLight} Enabled`,
		async (ctx) => {
			await setSessions(ctx);
			await updateUser(ctx.chat?.id?.toString(), {
				autoBuy: !ctx.session.autoBuy,
			});
			await setSessions(ctx);
			ctx.menu.update();
		}
	)
	.row()
	.text("== Auto Buy Amount ==")
	.row()
	.text(
		async (ctx) => {
			return ctx.session.buyAmount === "1"
				? `${greenLight} 1 FTM`
				: `${redLight} 1 FTM`;
		},
		async (ctx) => {
			await setSessions(ctx);
			await updateUser(ctx.chat?.id?.toString(), {
				buyAmount: "1",
			});
			await setSessions(ctx);
			ctx.menu.update();
		}
	)
	.text(
		async (ctx) => {
			return ctx.session.buyAmount === "2"
				? `${greenLight} 2 FTM`
				: `${redLight} 2 FTM`;
		},
		async (ctx) => {
			await setSessions(ctx);
			await updateUser(ctx.chat?.id?.toString(), {
				buyAmount: "2",
			});
			await setSessions(ctx);
			ctx.menu.update();
		}
	)

	.row()
	.text(
		(ctx) =>
			ctx.session.buyAmount === "1" || ctx.session.buyAmount === "2"
				? " === Custom ==="
				: `=== ${ctx.session.buyAmount} Custom ===`,
		async (ctx) =>
			await ctx.conversation.enter("customBuyAmountConversation")
	)
	.row()
	.text("===SLipage ===")
	.row()
	.text(
		async (ctx) => {
			return ctx.session.slippage === "0.5"
				? `${greenLight} 0.5 % `
				: `${redLight} 0.5 %`;
		},
		async (ctx) => {
			await setSessions(ctx);
			await updateUser(ctx.chat?.id?.toString(), {
				slippage: "0.5",
			});
			await setSessions(ctx);
			ctx.menu.update();
		}
	)
	.text(
		async (ctx) => {
			return ctx.session.slippage === "1"
				? `${greenLight} 1 % `
				: `${redLight} 1 %`;
		},
		async (ctx) => {
			await setSessions(ctx);
			await updateUser(ctx.chat?.id?.toString(), {
				slippage: "1",
			});
			await setSessions(ctx);
			ctx.menu.update();
		}
	)
	.text(
		async (ctx) => {
			return ctx.session.slippage === "50"
				? `${greenLight} 50 % `
				: `${redLight} 50 %`;
		},
		async (ctx) => {
			await setSessions(ctx);
			await updateUser(ctx.chat?.id?.toString(), {
				slippage: "50",
			});
			await setSessions(ctx);
			ctx.menu.update();
		}
	)
	.row()
	.text(
		async (ctx) => {
			return ctx.session.slippage === "20"
				? `${greenLight} 20 % `
				: `${redLight} 20 %`;
		},
		async (ctx) => {
			await setSessions(ctx);
			await updateUser(ctx.chat?.id?.toString(), {
				slippage: "20",
			});
			await setSessions(ctx);
			ctx.menu.update();
		}
	)
	.text(
		async (ctx) => {
			return ctx.session.slippage === "10"
				? `${greenLight} 10 % `
				: `${redLight} 10 %`;
		},
		async (ctx) => {
			await setSessions(ctx);
			await updateUser(ctx.chat?.id?.toString(), {
				slippage: "10",
			});
			await setSessions(ctx);
			ctx.menu.update();
		}
	)
	.row()
	.text("=== Sell Amount ===")
	.row()
	.text(
		async (ctx) => {
			return ctx.session.sellAmount === "10"
				? `${greenLight} 10 % `
				: `${redLight} 10 %`;
		},
		async (ctx) => {
			await setSessions(ctx);
			await updateUser(ctx.chat?.id?.toString(), {
				sellAmount: "10",
			});
			await setSessions(ctx);
			ctx.menu.update();
		}
	)
	.text(
		async (ctx) => {
			return ctx.session.sellAmount === "25"
				? `${greenLight} 25 % `
				: `${redLight} 25 %`;
		},
		async (ctx) => {
			await setSessions(ctx);
			await updateUser(ctx.chat?.id?.toString(), {
				sellAmount: "25",
			});
			await setSessions(ctx);
			ctx.menu.update();
		}
	)
	.row()
	.text(
		async (ctx) => {
			return ctx.session.sellAmount === "50"
				? `${greenLight} 50 % `
				: `${redLight} 50 %`;
		},
		async (ctx) => {
			await setSessions(ctx);
			await updateUser(ctx.chat?.id?.toString(), {
				sellAmount: "50",
			});
			await setSessions(ctx);
			ctx.menu.update();
		}
	)
	.text(
		async (ctx) => {
			return ctx.session.sellAmount === "100"
				? `${greenLight} 100 % `
				: `${redLight} 100 %`;
		},
		async (ctx) => {
			await setSessions(ctx);
			await updateUser(ctx.chat?.id?.toString(), {
				sellAmount: "100",
			});
			await setSessions(ctx);
			ctx.menu.update();
		}
	)
	.row()
	.text("Return to trading Menu", async (ctx) => {
		await ctx.deleteMessage();
		await ctx.reply(`/trade go to trading  panel`);
		//await tradepanelContoller(ctx);
	});

export const TradingMenu = new Menu<MyContext>("main-trading-menu")
	.text("Buy", async (ctx) => await buyTokenController(ctx))
	.text("Sell")
	.row()
	.text("Setting", async (ctx) => {
		await ctx.deleteMessage();
		await configContoller(ctx);
	})
	.text("Wallet")
	.row()
	.text("My orders")
	.row()
	.text(
		"import token",
		async (ctx) => await ctx.conversation.enter("importTokenConversation")
	);

export const buyMenu = (contractAdress: string) =>
	new InlineKeyboard()
		.text("Cancel", `cancel`)
		.row()
		.url(
			"Gecko Terminal",
			"https://dexscreener.com/fantom/0x449fedbacc22cd3d835d966c0fa00552fb6bd3f4"
		)
		.url(
			"Etherscan",
			"https://dexscreener.com/fantom/0x449fedbacc22cd3d835d966c0fa00552fb6bd3f4"
		)
		.url(
			"Dexscreen",
			"https://dexscreener.com/fantom/0x449fedbacc22cd3d835d966c0fa00552fb6bd3f4"
		)
		.row()
		.text(`Buy 100 FTM`, `buy-100-${contractAdress}`)
		.text(`Buy 20 FTM`, `buy-20-${contractAdress}`)
		.text(`Buy X FTM`, `buy-custom-${contractAdress}`)
		.row()
		.text(`Refresh`);
export const sellMenu = (contractAdress: string) =>
	new InlineKeyboard()
		.text("Cancel", `cancel`)
		.row()
		.url(
			"Gecko Terminal",
			"https://dexscreener.com/fantom/0x449fedbacc22cd3d835d966c0fa00552fb6bd3f4"
		)
		.url(
			"Etherscan",
			"https://dexscreener.com/fantom/0x449fedbacc22cd3d835d966c0fa00552fb6bd3f4"
		)
		.url(
			"Dexscreen",
			"https://dexscreener.com/fantom/0x449fedbacc22cd3d835d966c0fa00552fb6bd3f4"
		)
		.row()
		.text(`Sell 100 %`, `sell-100-${contractAdress}`)
		.text(`Sell 50 %`, `sell-50-${contractAdress}`)
		.text(`Sell X %`, `sell-custom-${contractAdress}`)
		.row()
		.text(`Refresh`);
export { menuComposer };
