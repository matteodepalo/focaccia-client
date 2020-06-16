import withApollo from 'next-with-apollo';
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from '@apollo/react-hooks'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { createHttpLink } from 'apollo-link-http'
import { parseCookies } from 'nookies'
import omitDeep from 'omit-deep-lodash'
import { ApolloLink } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities';

export default withApollo(
  ({ initialState, ctx }) => {
    const cleanTypenameLink = new ApolloLink((operation, forward) => {
      const keysToOmit = ['__typename', 'createdAt', 'updatedAt']

      const def = getMainDefinition(operation.query)
      if (def && def.kind === 'OperationDefinition' && def.operation === 'mutation') {
        operation.variables = omitDeep(operation.variables, keysToOmit)
      }
      return forward ? forward(operation) : null
    })

    const authLink = setContext((_, { headers }) => {
      const accessToken = parseCookies(ctx).accessToken

      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : ''
        }
      }
    });

    const httpLink = createHttpLink({
      uri: process.env.NEXT_PUBLIC_API_URL,
      fetch
    })

    return new ApolloClient({
      link: authLink.concat(cleanTypenameLink).concat(httpLink),
      ssrMode: Boolean(ctx),
      cache: new InMemoryCache().restore(initialState || {})
    });
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    }
  }
);