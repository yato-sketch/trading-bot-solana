import { MyContext } from "../bot";
import { setSessions } from "../handlers";

export async function sellTokenController(ctx: MyContext) {
	await setSessions(ctx);
}
