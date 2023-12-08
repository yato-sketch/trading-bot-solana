import { conversations, createConversation } from "@grammyjs/conversations";
import { I18n } from "@grammyjs/i18n";
import { BotWorker } from "@grammyjs/runner";
import { session, MemorySessionStorage, GrammyError, HttpError } from "grammy";
import { MyContext } from "./bot";
import { commandsComposer } from "./commands";
import {
	setCustomTotalSupply,
	setCustomInitTax,
	setTokenMetadataConversation,
	setCustomFinalTaxConversation,
} from "./conversations";
import withdrawEthConversation from "./conversations/withdrawEth.conversations";
import {
	callBackQueryComposer,
	callbackHandler,
	listenerComposer,
} from "./handlers";
import { accountMenu, menuComposer } from "./views";

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
}

// Create a new bot worker.
const bot = new BotWorker(process.env.BOT_TOKEN || "not bot token");

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
bot.use(accountMenu);
bot.use(createConversation(setCustomTotalSupply, "setCustomTotalSupply"));
bot.use(menuComposer);
bot.use(createConversation(setCustomInitTax, "setCustomInitTax"));
bot.use(
	createConversation(
		setTokenMetadataConversation,
		"setTokenMetadataConversation"
	)
);

bot.use(
	createConversation(
		setCustomFinalTaxConversation,
		"setCustomFinalTaxConversation"
	)
);

bot.api.setMyCommands([
	{ command: "help", description: "Help and Support " },
	{ command: "start", description: "Get Started with the Token Deployer" },
	{ command: "tokens", description: "My deployed tokens" },
	{ command: "wallet", description: "My wallet details" },
	{ command: "create", description: "Create ERC20 token" },
]);

// Handle the /start command.
bot.use(callBackQueryComposer);

bot.use(commandsComposer);
bot.use(callbackHandler);
bot.use(listenerComposer);

bot.on("message", (ctx) => {
	console.log("jj");
	if (ctx.chat.type === "group") {
		console.log("here");
	}
});

bot.catch((err: { ctx: any; error: any }) => {
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
