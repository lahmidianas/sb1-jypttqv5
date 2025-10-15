/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  mutation CreateBooking($input: BookingInput!) {\n    createBooking(input: $input) {\n      id\n      checkIn\n      checkOut\n      status\n      totalPrice\n      property {\n        id\n        title\n      }\n    }\n  }\n": types.CreateBookingDocument,
    "\n  mutation CancelBooking($id: ID!) {\n    cancelBooking(id: $id) {\n      id\n      status\n    }\n  }\n": types.CancelBookingDocument,
    "\n  mutation CreateProperty($input: PropertyInput!) {\n    createProperty(input: $input) {\n      id\n      title\n      description\n      type\n      location\n      price\n      images\n      features\n      available\n    }\n  }\n": types.CreatePropertyDocument,
    "\n  mutation UpdateProperty($id: ID!, $input: PropertyInput!) {\n    updateProperty(id: $id, input: $input) {\n      id\n      title\n      description\n      type\n      location\n      price\n      images\n      features\n      available\n    }\n  }\n": types.UpdatePropertyDocument,
    "\n  query GetProperties {\n    properties {\n      id\n      title\n      description\n      type\n      location\n      price\n      images\n      features\n      available\n    }\n  }\n": types.GetPropertiesDocument,
    "\n  query GetProperty($id: ID!) {\n    property(id: $id) {\n      id\n      title\n      description\n      type\n      location\n      price\n      images\n      features\n      available\n    }\n  }\n": types.GetPropertyDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateBooking($input: BookingInput!) {\n    createBooking(input: $input) {\n      id\n      checkIn\n      checkOut\n      status\n      totalPrice\n      property {\n        id\n        title\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateBooking($input: BookingInput!) {\n    createBooking(input: $input) {\n      id\n      checkIn\n      checkOut\n      status\n      totalPrice\n      property {\n        id\n        title\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelBooking($id: ID!) {\n    cancelBooking(id: $id) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation CancelBooking($id: ID!) {\n    cancelBooking(id: $id) {\n      id\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateProperty($input: PropertyInput!) {\n    createProperty(input: $input) {\n      id\n      title\n      description\n      type\n      location\n      price\n      images\n      features\n      available\n    }\n  }\n"): (typeof documents)["\n  mutation CreateProperty($input: PropertyInput!) {\n    createProperty(input: $input) {\n      id\n      title\n      description\n      type\n      location\n      price\n      images\n      features\n      available\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProperty($id: ID!, $input: PropertyInput!) {\n    updateProperty(id: $id, input: $input) {\n      id\n      title\n      description\n      type\n      location\n      price\n      images\n      features\n      available\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProperty($id: ID!, $input: PropertyInput!) {\n    updateProperty(id: $id, input: $input) {\n      id\n      title\n      description\n      type\n      location\n      price\n      images\n      features\n      available\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProperties {\n    properties {\n      id\n      title\n      description\n      type\n      location\n      price\n      images\n      features\n      available\n    }\n  }\n"): (typeof documents)["\n  query GetProperties {\n    properties {\n      id\n      title\n      description\n      type\n      location\n      price\n      images\n      features\n      available\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProperty($id: ID!) {\n    property(id: $id) {\n      id\n      title\n      description\n      type\n      location\n      price\n      images\n      features\n      available\n    }\n  }\n"): (typeof documents)["\n  query GetProperty($id: ID!) {\n    property(id: $id) {\n      id\n      title\n      description\n      type\n      location\n      price\n      images\n      features\n      available\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;