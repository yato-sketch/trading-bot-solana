import { request, gql, GraphQLClient } from "graphql-request";

const graphQLClient = new GraphQLClient(process.env.GRAPH_CLIENT);
const queryAll = gql`
	query MyQuery {
		betPlaceds {
			id
			pool
			user
			eventId
		}
	}
`;

const singleUserQuery = () => gql`
	query MyQuery($address: String!) {
		newContractDeployeds(where: { owner: $address }) {
			transactionHash
			totalSupply
			tokenName
			deployedAddress
			symbol
			owner
			id
		}
	}
`;
const getTokenByTokenAddressQuery = () => gql`
	query MyQuery($address: String!) {
		newContractDeployeds(where: { deployedAddress: $address }) {
			transactionHash
			totalSupply
			tokenName
			deployedAddress
			symbol
			owner
			id
		}
	}
`;
export const getUserDeployedTokens = async (address: string) => {
	const variables = {
		address: address,
	};
	let results;
	results = await graphQLClient.request(singleUserQuery(), variables);

	return results.newContractDeployeds;
};

export const getUserDeployedTokensByTokenAddress = async (address: string) => {
	const variables = {
		address: address,
	};
	let results;
	results = await graphQLClient.request(
		getTokenByTokenAddressQuery(),
		variables
	);

	return results.newContractDeployeds;
};
