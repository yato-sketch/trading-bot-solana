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
import { importTokenConversation } from "./conversations";
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
	menuComposer,
	fundContractButton,
	TradingMenu,
	settingMenu,
	returnToMainMenu,
	gasPresetMenu,
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
import { CreateWallet } from "./web3";
import { importWalletConversation } from "./conversations/importWallet.conversation";
import { setcustomSlippageConversation } from "./conversations/setCustomSlippage.conversation";
export type MyContext = Context &
	SessionFlavor<SessionData> &
	ConversationFlavor;
interface SessionData {
	walletAddress: string | null;
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
	isSlow: boolean;
	isFast: boolean;
	isAverage: boolean;
	isMaxSpeed: boolean;
}

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot<MyContext>(process.env.BOT_TOKEN || "not bot token"); // <-- put your bot token between the ""

function initial(): SessionData {
	return {
		walletAddress: null,
		tokenNameIsSet: false,
		tokenDecimalsSet: false,
		tokendecimal: 0,

		tokenName: "",

		privateKey: "",
		amountAmountLiqtoAdd: "",
		userName: "",
		autoBuy: false,
		autoSell: false,
		slippage: "",
		buyAmount: "0",
		sellAmount: "0",
		tokens: [],
		notification: false,
		customBuyToken: "",
		tokenBalance: "",
		customSellToken: "",
		isAverage: false,
		isMaxSpeed: false,
		isFast: false,
		isSlow: false,
	};
}

const i18n = new I18n<MyContext>({
	defaultLocale: "en", // see below for more information
	directory: "locales", // Load all translation files from locales/.
});
// bot.use(i18n);
const { getDecimals, getSymbol, EthBalance } = new CreateWallet();
// bot.on("msg:text", (ctx) => {
// 	console.log("jj");
// 	const address = ctx.msg.text;
// 	const rpc = process.env.RPC;
// 	return;
// });

bot.use(session({ initial, storage: new MemorySessionStorage<SessionData>() }));
bot.use(conversations());
bot.use(createConversation(withdrawEthConversation, "withdrawEthConversation"));
bot.use(createConversation(buyTokenConversation, "buyTokenConversation"));
bot.use(createConversation(sellTokenConversation, "sellTokenConversation"));
bot.use(
	createConversation(importWalletConversation, "importWalletConversation")
);
bot.use(
	createConversation(
		setcustomSlippageConversation,
		"setcustomSlippageConversation"
	)
);
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
// bot.use(accountMenu);
bot.use(
	createConversation(setTradeAmountConversation, "setTradeAmountConversation")
);
bot.use(gasPresetMenu);

bot.use(fundContractButton);
bot.use(settingMenu);
bot.use(TradingMenu);

bot.use(menuComposer);

bot.api.setMyCommands([
	{ command: "help", description: "Help and Support " },
	{ command: "start", description: "Start Tradding" },
	{ command: "config", description: "configure trading settings" },
	{ command: "wallet", description: "Wallet details" },
	{ command: "orders", description: "checkout pnl and opened Trades" },
	{ command: "rewards", description: "See Rewards" },
	{ command: "faq", description: "Frequently Asked questions" },
]);

// Handle the /start command.
bot.use(commandsComposer);
bot.use(callBackQueryComposer);

bot.use(callbackHandler);
bot.use(listenerComposer);

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
