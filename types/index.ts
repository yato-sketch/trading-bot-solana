export * from "./web3";

export type User = {
	PrivateKey: string;
	tg_id: string | any | undefined | never | null;
	Pin: string | any | null;
	Mnemonic: string;
};

export type BettingPoolProps = {
	eventId: string;
	privateKey: string;
	mnemonic: string;
	hasEnded: boolean | undefined | unknown;
};

export type BettingPoolTransaction = {
	eventId: string;
	poolWalletAddress: string;
	amountIn: string;
	oddType: string;
};
