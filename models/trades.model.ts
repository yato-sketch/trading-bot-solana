import { Trader, prisma } from "./prisma.call";

export async function fetchTradeByUserId(userId: string) {}
export async function createTrade(
	tgId: string,
	tokenAddress: string,
	priceBoughtAt: string,
	amount: string
) {
	const findOrders = await prisma.orders.findUnique({ where: { tgId } });

	if (findOrders) {
		const newTrade = await prisma.trades.create({
			data: {
				tokenAddress,
				priceBoughtAt,
				amount,
				Orders: { connect: { id: findOrders.id } },
			},
		});
	} else {
		const order = await prisma.orders.create({ data: { tgId } });
		const newTrade = await prisma.trades.create({
			data: {
				tokenAddress,
				priceBoughtAt,
				amount,
				Orders: { connect: { id: order.id } },
			},
		});
	}
}
export async function getAllOrderByUserId(userId: string) {
	return await prisma.orders.findUnique({
		where: { tgId: userId },
		include: { myTrades: true },
	});
}
