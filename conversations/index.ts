import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { MyContext } from "../bot";
export * from "./withdrawEth.conversations";
export * from "./fundContract.conversation";
export * from "./importToken.conversation";
type MyContext2 = MyContext & ConversationFlavor;
export type MyConversation = Conversation<MyContext2>;
export async function initConversation() {}
