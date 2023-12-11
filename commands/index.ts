import { Composer } from "grammy";
import { helpCommand } from "./help.command";
import { startCommand } from "./start.command";
import { configsCommand } from "./configs.command";
import { WalletCommand } from "./wallet.command";
import { ordersCommmand } from "./orders.command";
import { tradeCommand } from "./trade.command";
let commandsComposer = new Composer();

let commands: any[] = [
	{ name: "help", command: helpCommand },
	{ name: "start", command: startCommand },
	{ name: "config", command: configsCommand },
	{ name: "wallet", command: WalletCommand },
	{ name: "orders", command: ordersCommmand },
	{ name: "trade", command: tradeCommand },
];

for (let index = 0; index < commands.length; index++) {
	commandsComposer.command(commands[index].name, commands[index].command);
}
//commands.command();
export { commandsComposer };
