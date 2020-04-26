import { ApolloClient } from 'apollo-client'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import config from './next.config'
import { NextPageContext } from 'next';
import fetch from 'isomorphic-unfetch'

export default function createApolloClient(initialState: NormalizedCacheObject, ctx: NextPageContext) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: new HttpLink({
      uri: config().env.API_URL, // Server URL (must be absolute)
      fetch
    }),
    cache: new InMemoryCache().restore(initialState),
  })
}