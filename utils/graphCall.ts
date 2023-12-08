import { request, gql, GraphQLClient } from "graphql-request";

const graphQLClient = new GraphQLClient(
	"https://api.studio.thegraph.com/query/51321/safememe-deployer-graph/1.2.0"
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
	query MyQuery($hash: String!) {
		newContractDeployeds(where: { transactionHash: $hash }) {
			id
			transactionHash
			deployedAddress
		}
	}
`;
export const getUserData = async (address: string) => {
	const variables = {
		address: address,
	};
	let results;
	results = await graphQLClient.request(singleUserQuery(), variables);
	console.log(results);
	return results.betPlaceds;
};
