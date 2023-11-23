import { request, gql, GraphQLClient } from "graphql-request";

const graphQLClient = new GraphQLClient(
	"https://api.studio.thegraph.com/query/51321/cric-bot-graph/1.0.0"
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
		betPlaceds(where: { user: $address }) {
			id
			user
			eventId
			pool
			blockNumber
			blockTimestamp
			transactionHash
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
