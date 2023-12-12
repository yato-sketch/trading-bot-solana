import {
	Bot,
	Context,
	GrammyError,
	HttpError,
	MemorySessionStorage,
	SessionFlavor,
} from "grammy";
import { session } from "grammy";
import { commandsComposer } from "./commands";
import {
	setCustomTotalSupply,
	setCustomInitTax,
	setTokenMetadataConversation,
	setCustomFinalTaxConversation,
	fundContractConversation,
	importTokenConversation,
} from "./conversations";
import {
	ConversationFlavor,
	conversations,
	createConversation,
} from "@grammyjs/conversations";
import { callbackHandler, listenerComposer } from "./handlers";
import {
	CreateTokenMenu,
	initTaxMenu,
	finalTaxMenu,
	decimalMenu,
	DeployTokenMenu,
	menuComposer,
	fundContractButton,
	TradingMenu,
	settingMenu,
} from "./views";
import { accountMenu } from "./views";
import withdrawEthConversation from "./conversations/withdrawEth.conversations";
import { freeStorage } from "@grammyjs/storage-free";
import { callBackQueryComposer } from "./handlers";
import { distribute, run, sequentialize } from "@grammyjs/runner";
import validate from "./validations/config.validation";
import { I18n } from "@grammyjs/i18n";
import { customBuyAmountConversation } from "./conversations/customBuyAmount.conversation";
import { buyTokenConversation } from "./conversations/BuyToken.conversation";
import { setTradeAmountConversation } from "./conversations/setTradeAmountConversation.conversation";
import { sellTokenConversation } from "./conversations/SellToken.conversation";
import { setSellTradeAmountConversation } from "./conversations/setSellTradeAmount.conversation";
export type MyContext = Context &
	SessionFlavor<SessionData> &
	ConversationFlavor;
interface SessionData {
	walletAddress: string | null;
	isSetTotalSupply: boolean;
	totalSupply: number;
	isInitTaxSet: boolean;
	initTax: number;
	isFinTaxSet: boolean;
	finTax: number;
	symbolIsSet: boolean;
	tokenSymbol: string;
	marketingWalletIsSet: boolean;
	marketingWalletAddress: string;
	tokenName: string;
	tokenNameIsSet: boolean;
	tokenDecimalsSet: boolean;
	tokendecimal: number;
	privateKey: string;
	amountAmountLiqtoAdd: "";
	userName: string;
	autoBuy: boolean;
	autoSell: boolean;
	slippage: string;
	buyAmount: string;
	sellAmount: string;
	tokens: string[];
	notification: boolean;
	customBuyToken: string;
	customSellToken: string;
	tokenBalance: any;
}

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot<MyContext>(process.env.BOT_TOKEN || "not bot token"); // <-- put your bot token between the ""

function initial(): SessionData {
	return {
		walletAddress: null,
		isSetTotalSupply: false,
		isInitTaxSet: false,
		isFinTaxSet: false,
		symbolIsSet: false,
		marketingWalletIsSet: false,
		tokenNameIsSet: false,
		tokenDecimalsSet: false,
		tokendecimal: 0,
		totalSupply: 0,
		tokenSymbol: "",
		marketingWalletAddress: "",
		tokenName: "",
		finTax: 0,
		initTax: 0,
		privateKey: "",
		amountAmountLiqtoAdd: "",
		userName: "",
		autoBuy: false,
		autoSell: false,
		slippage: "",
		buyAmount: "",
		sellAmount: "",
		tokens: [],
		notification: false,
		customBuyToken: "",
		tokenBalance: "",
		customSellToken: "",
	};
}

const i18n = new I18n<MyContext>({
	defaultLocale: "en", // see below for more information
	directory: "locales", // Load all translation files from locales/.
});
// bot.use(i18n);

bot.use(session({ initial, storage: new MemorySessionStorage<SessionData>() }));
bot.use(conversations());
bot.use(createConversation(withdrawEthConversation, "withdrawEthConversation"));
bot.use(createConversation(buyTokenConversation, "buyTokenConversation"));
bot.use(createConversation(sellTokenConversation, "sellTokenConversation"));
bot.use(
	createConversation(
		customBuyAmountConversation,
		"customBuyAmountConversation"
	)
);
bot.use(
	createConversation(
		setSellTradeAmountConversation,
		"setSellTradeAmountConversation"
	)
);
bot.use(
	createConversation(setTradeAmountConversation, "setTradeAmountConversation")
);
bot.use(createConversation(importTokenConversation, "importTokenConversation"));
bot.use(accountMenu);
bot.use(fundContractButton);
bot.use(settingMenu);
bot.use(TradingMenu);
bot.use(settingMenu);

bot.use(createConversation(setCustomTotalSupply, "setCustomTotalSupply"));
bot.use(menuComposer);

bot.api.setMyCommands([
	{ command: "help", description: "Help and Support " },
	{ command: "start", description: "Get Started with the trading bot" },
	{ command: "config", description: "configure trading settings" },
	{ command: "wallet", description: "Wallet details" },
	{ command: "orders", description: "checkout pnl and opened Trades" },
	{ command: "trade", description: "Start Trading" },
]);

// Handle the /start command.
bot.use(callBackQueryComposer);

bot.use(commandsComposer);
bot.use(callbackHandler);
bot.use(listenerComposer);

bot.on("msg:text", (ctx) => {
	console.log("jj");
});

bot.catch((err: { ctx: MyContext; error: any }) => {
	const ctx = err.ctx;
	console.error(`Error while handling update ${ctx.update.update_id}:`);
	const e = err.error;
	if (e instanceof GrammyError) {
		console.error("Error in request:", e.description);
	} else if (e instanceof HttpError) {
		console.error("Could not contact Telegram:", e);
	} else {
		console.error("Unknown error:", e);
	}
});
// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.use(distribute(__dirname + "./worker", { count: 3 }));
validate();
run(bot);
