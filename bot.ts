import { Bot, Context, GrammyError, HttpError, SessionFlavor } from "grammy";
import { session } from "grammy";
import { commandsComposer } from "./commands";
import {
	setCustomTotalSupply,
	setCustomInitTax,
	setTokenMetadataConversation,
	setCustomFinalTaxConversation,
} from "./conversations";
import {
	ConversationFlavor,
	conversations,
	createConversation,
} from "@grammyjs/conversations";
import { callbackHandler } from "./handlers";
import {
	CreateTokenMenu,
	GetTotalSupplyMenu,
	initTaxMenu,
	finalTaxMenu,
	decimalMenu,
	DeployTokenMenu,
} from "./views";
import { callBackQueryComposer } from "./handlers";
import { distribute, run, sequentialize } from "@grammyjs/runner";
import validate from "./validations/config.validation";
import { I18n } from "@grammyjs/i18n";
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
	};
}

const i18n = new I18n<MyContext>({
	defaultLocale: "en", // see below for more information
	directory: "locales", // Load all translation files from locales/.
});
// bot.use(i18n);
// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// bot.use(conversations() as any);

bot.use(session({ initial }));
bot.use(conversations());
bot.use(DeployTokenMenu);
bot.use(
	createConversation(setCustomTotalSupply, "setCustomTotalSupply") as any
);
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

bot.use(decimalMenu);
bot.use(finalTaxMenu);
bot.use(initTaxMenu);
bot.use(GetTotalSupplyMenu);
bot.use(CreateTokenMenu);

bot.api.setMyCommands([
	{ command: "help", description: "Help and Support " },
	{ command: "start", description: "Get Started with the Token Deployer" },
	{ command: "tokens", description: "My deployed tokens" },
	{ command: "manage", description: "Manage deployed token" },
	{ command: "wallet", description: "My wallet details" },
	{ command: "create", description: "Create ERC20 token" },
]);

// Handle the /start command.
bot.use(callBackQueryComposer);

bot.use(commandsComposer);
bot.use(callbackHandler);

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
bot.use(distribute(__dirname + "./worker", { count: 2 }));
validate();
run(bot);
