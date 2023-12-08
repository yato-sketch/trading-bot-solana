import { TokenDeployedGraph } from "../types";

export type customStateContext = {
	totalSupply: number;
	initTax: number;
	finTax: number;
	tokenName: any;
	tokenSymbol: string;
	tokendecimal: string;
	marketingWalletAddress: string;
	grouplink: string;
	webSiteLink: string;
	deployerUsername: string;
	deployerId: string;
};
class State {
	totalSupply: number;
	initTax: number;
	finTax: number;
	tokenName: string;
	tokenSymbol: string;
	tokendecimal: number;
	marketingWalletAddress: string;
	deployedTokens: Map<string, TokenDeployedGraph[]>;

	state: object;
	constructor() {
		this.state = {};
		this.deployedTokens = new Map();
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
	setDeployedTokens(id: string, data: TokenDeployedGraph[]) {
		return this.deployedTokens.set(id, data);
	}
	getDeploTOkens(id: string) {
		return this.deployedTokens.get(id);
	}
}

export const myState = new State();
