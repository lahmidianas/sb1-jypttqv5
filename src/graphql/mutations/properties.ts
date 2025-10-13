import { gql } from '@apollo/client';

export const CREATE_PROPERTY = gql`
  mutation CreateProperty($input: PropertyInput!) {
    createProperty(input: $input) {
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

export const UPDATE_PROPERTY = gql`
  mutation UpdateProperty($id: ID!, $input: PropertyInput!) {
    updateProperty(id: $id, input: $input) {
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