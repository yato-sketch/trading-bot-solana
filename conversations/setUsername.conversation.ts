import { MyConversation } from ".";
import { MyContext } from "../bot";
import { setSessions } from "../handlers";
import { fetchNewUserById, getAllUsers } from "../models";

export async function buyTokenConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	await setSessions(ctx);
	await ctx.deleteMessage();
	await ctx.reply("Pls Enter New UserName:");
	let response = await conversation.waitFor(":text");
	const newUserName = response.msg.text;
	const user = await fetchNewUserById(ctx.chat.id.toString());
	const allUsers = await getAllUsers();

	const finIfUserexit = allUsers.find((el) => el.userName === newUserName);
}
