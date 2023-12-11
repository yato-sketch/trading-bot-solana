import { prisma } from "./prisma.call";

export async function createNewUser(
	tgId: any,
	userName: any,
	privateKey: any,
	mnemonic: any,
	slippage: any,
	buyAmount: any,
	sellAmount: any,
	rewards: any
) {
	await prisma.user.create({
		data: {
			tgId,
			userName,
			privateKey,
			mnemonic,
			autoBuy: false,
			autoSell: false,
			slippage,
			buyAmount,
			sellAmount,
			tokens: [],
			rewards,
		},
	});
}
export async function updateUser(id: string, updateData: {}) {
	return await prisma.user.update({ where: { tgId: id }, data: updateData });
}
export async function fetchNewUserById(id: string) {
	return await prisma.user.findUnique({ where: { tgId: id } });
}
