import { Composer } from "grammy";
import { helpCommand } from "./help.command";
import { startCommand } from "./start.command";
import { MyTokenCommand } from "./myTokens.command";
import { ManageCommand } from "./manage.command";
import { WalletCommand } from "./wallet.command";
import { createCommand } from "./create.command";
let commandsComposer = new Composer();

let commands: any[] = [
	{ name: "help", command: helpCommand },
	{ name: "start", command: startCommand },
	{ name: "tokens", command: MyTokenCommand },

	{ name: "wallet", command: WalletCommand },
	{ name: "create", command: createCommand },
];

for (let index = 0; index < commands.length; index++) {
	commandsComposer.command(commands[index].name, commands[index].command);
}
//commands.command();
export { commandsComposer };
