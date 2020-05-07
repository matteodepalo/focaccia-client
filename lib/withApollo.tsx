import withApollo from 'next-with-apollo';
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from '@apollo/react-hooks'
import fetch from 'isomorphic-unfetch'
import config from './config'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { createHttpLink } from 'apollo-link-http'

export default withApollo(
  ({ initialState, ctx }) => {
    const authLink = setContext((_, { headers }) => {
      const cookie = ctx?.req?.headers.cookie

      if (cookie) {
        return {
          headers: {
            ...headers,
            cookie
          }
        }
      } else {
        return {
          headers
        }
      }
    });

    const httpLink = createHttpLink({
      uri: config.API_URL,
      credentials: 'include',
      fetch
    })

    // TODO: Customize fetch so that whenever you encounter a 401 we refresh the token and retry the request with the refreshed token

    return new ApolloClient({
      link: authLink.concat(httpLink),
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