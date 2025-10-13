import { gql } from '@apollo/client';

export const GET_PROPERTIES = gql`
  query GetProperties {
    properties {
      id
      title
      description
      type
      location
      price
      images
      features
      available
    }
  }
`;

export const GET_PROPERTY = gql`
  query GetProperty($id: ID!) {
    property(id: $id) {
      id
      title
      description
      type
      location
      price
      images
      features
      available
    }
  }
`;