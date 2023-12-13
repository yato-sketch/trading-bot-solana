import { MyContext } from "../bot";
import { fetchNewUserById, updateUser } from "../models";

async function updateRefCoun(referralId: string) {
	const referralDetails = await fetchNewUserById(referralId);
	const refCount = (await referralDetails).referralCount;
	await updateUser(referralId, { referralCount: refCount + 1, points: 80 });
}
export async function referringHandler(ctx: MyContext, referrr: number) {
	/**@async  */
	const userId = ctx.chat.id.toString();
	const userDetails = fetchNewUserById(userId);
	if ((await userDetails).referrer) {
	} else {
		await updateUser(userId, { referrer: referrr });
		await updateRefCoun(referrr.toString());
	}
}
