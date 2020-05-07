import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import { NextPageContext } from 'next'
import { ApolloClient as Client } from 'apollo-client'
import config from './config'

export class ApolloClient extends Client<NormalizedCacheObject> {
  toJSON!: Function
}

export default function createApolloClient(initialState: NormalizedCacheObject, ctx?: NextPageContext) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: new HttpLink({
      uri: config.API_URL, // Server URL (must be absolute)
      credentials: 'include',
      fetch
    }),
    cache: new InMemoryCache().restore(initialState)
  })
}