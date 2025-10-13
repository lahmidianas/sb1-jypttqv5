import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { supabase } from './supabase';

const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
  // Get the anonymous key from environment variables
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // Get the session token if user is authenticated
  const session = await supabase.auth.getSession();
  const token = session?.data?.session?.access_token;

  return {
    headers: {
      ...headers,
      'apikey': anonKey,
      'Authorization': token ? `Bearer ${token}` : `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});