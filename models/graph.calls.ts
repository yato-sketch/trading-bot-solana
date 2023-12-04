import { request, gql, GraphQLClient } from "graphql-request";

const graphQLClient = new GraphQLClient(
	"https://api.studio.thegraph.com/query/51321/t2-dep-bot-graph/2.0"
);
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
export const getUserDeployedTokens = async (address: string) => {
	const variables = {
		address: address,
	};
	let results;
	results = await graphQLClient.request(singleUserQuery(), variables);

	return results.newContractDeployeds;
};
