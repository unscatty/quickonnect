/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    mutation AddLink($linkData: links_insert_input!) {\n      newLink: insert_links_one(object: $linkData) {\n        ...LinkInfo\n      }\n    }\n  ": types.AddLinkDocument,
    "\n  query UserAllLinks {\n    links {\n      ...LinkInfo\n    }\n  }\n": types.UserAllLinksDocument,
    "\n  fragment LinkInfo on links {\n    id\n    name\n    type\n    url\n  }\n": types.LinkInfoFragmentDoc,
    "\n  subscription NewLinks {\n    newLinks: links {\n      ...LinkInfo\n    }\n  }\n": types.NewLinksDocument,
    "\n  mutation UserUpdateMetadata(\n    $id: uuid!\n    $displayName: String!\n    $metadata: jsonb\n  ) {\n    userData: updateUser(\n      pk_columns: { id: $id }\n      _set: { displayName: $displayName, metadata: $metadata }\n    ) {\n      displayName\n      metadata\n    }\n  }\n": types.UserUpdateMetadataDocument,
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
export function graphql(source: "\n    mutation AddLink($linkData: links_insert_input!) {\n      newLink: insert_links_one(object: $linkData) {\n        ...LinkInfo\n      }\n    }\n  "): (typeof documents)["\n    mutation AddLink($linkData: links_insert_input!) {\n      newLink: insert_links_one(object: $linkData) {\n        ...LinkInfo\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UserAllLinks {\n    links {\n      ...LinkInfo\n    }\n  }\n"): (typeof documents)["\n  query UserAllLinks {\n    links {\n      ...LinkInfo\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment LinkInfo on links {\n    id\n    name\n    type\n    url\n  }\n"): (typeof documents)["\n  fragment LinkInfo on links {\n    id\n    name\n    type\n    url\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription NewLinks {\n    newLinks: links {\n      ...LinkInfo\n    }\n  }\n"): (typeof documents)["\n  subscription NewLinks {\n    newLinks: links {\n      ...LinkInfo\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UserUpdateMetadata(\n    $id: uuid!\n    $displayName: String!\n    $metadata: jsonb\n  ) {\n    userData: updateUser(\n      pk_columns: { id: $id }\n      _set: { displayName: $displayName, metadata: $metadata }\n    ) {\n      displayName\n      metadata\n    }\n  }\n"): (typeof documents)["\n  mutation UserUpdateMetadata(\n    $id: uuid!\n    $displayName: String!\n    $metadata: jsonb\n  ) {\n    userData: updateUser(\n      pk_columns: { id: $id }\n      _set: { displayName: $displayName, metadata: $metadata }\n    ) {\n      displayName\n      metadata\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;