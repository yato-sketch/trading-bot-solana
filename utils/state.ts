export type customStateContext = {
	totalSupply: number;
	initTax: number;
	finTax: number;
};
class State {
	totalSupply: number;
	initTax: number;
	finTax: number;
	tokenName: string;
	tokenSymbol: string;
	tokendecimal: number;
	marketingWalletAddress: string;

	state: object;
	constructor() {
		this.state = {};
	}

	async setStore(k: string, value: customStateContext) {
		//	console.log({ k, value });
		return (this.state[k] = value);
	}
	async getStore(k: string): Promise<customStateContext> {
		return this.state[k];
	}
	async setDefaultState(k: string) {
		return (this.state[k] = { totalSupply: 0 });
	}
}

export const myState = new State();
