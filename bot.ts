import {
	Bot,
	CommandContext,
	Context,
	GrammyError,
	HttpError,
	SessionFlavor,
} from "grammy";
import { session } from "grammy";
import { commandsComposer } from "./commands";
import { initConversation } from "./conversations";
import {
	ConversationFlavor,
	conversations,
	createConversation,
} from "@grammyjs/conversations";
import { callbackHandler } from "./handlers";
import { CreateTokenMenu } from "./views";
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
	tokenNameIsSet: boolean;
	tokenDecimalsSet: boolean;
	tokendecimal: number;
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
		finTax: 0,
		initTax: 0,
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
bot.use(CreateTokenMenu);
bot.api.setMyCommands([
	{ command: "help", description: "Contact our Help Channel" },
	{ command: "start", description: "Get Started with the Token Deployer" },
]);

bot.use(conversations());
bot.use(createConversation(initConversation, "initConversation") as any);

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
