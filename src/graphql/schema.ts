import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import { supabase } from '../lib/supabase';

const typeDefs = `#graphql
  enum PropertyType {
    apartment
    villa
    traditional
  }

  type Property {
    id: ID!
    title: String!
    description: String!
    type: PropertyType!
    location: String!
    price: Float!
    images: [String!]!
    features: [String!]!
    available: Boolean!
    created_at: String!
    updated_at: String!
  }

  input PropertyInput {
    title: String!
    description: String!
    type: PropertyType!
    location: String!
    price: Float!
    images: [String!]!
    features: [String!]!
    available: Boolean
  }

  input PropertyFilter {
    type: PropertyType
    location: String
    minPrice: Float
    maxPrice: Float
    available: Boolean
  }

  type Query {
    properties(filter: PropertyFilter): [Property!]!
    property(id: ID!): Property
  }

  type Mutation {
    createProperty(input: PropertyInput!): Property!
    updateProperty(id: ID!, input: PropertyInput!): Property!
  }
`;

const resolvers = {
  Query: {
    properties: async (_, { filter }) => {
      let query = supabase.from('properties').select('*');

      if (filter) {
        if (filter.type) query = query.eq('type', filter.type);
        if (filter.location) query = query.ilike('location', `%${filter.location}%`);
        if (filter.minPrice) query = query.gte('price', filter.minPrice);
        if (filter.maxPrice) query = query.lte('price', filter.maxPrice);
        if (filter.available !== undefined) query = query.eq('available', filter.available);
      }

      const { data, error } = await query;

      if (error) throw new GraphQLError('Failed to fetch properties');
      return data;
    },

    property: async (_, { id }) => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw new GraphQLError('Property not found');
      return data;
    },
  },

  Mutation: {
    createProperty: async (_, { input }) => {
      const { data, error } = await supabase
        .from('properties')
        .insert([input])
        .select()
        .single();

      if (error) throw new GraphQLError('Failed to create property');
      return data;
    },

    updateProperty: async (_, { id, input }) => {
      const { data, error } = await supabase
        .from('properties')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new GraphQLError('Failed to update property');
      return data;
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});