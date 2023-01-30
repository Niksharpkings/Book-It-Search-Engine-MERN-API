// Type definitions: Type definitions, or TypeDefs for short, involves literally defining every piece of data that the client can expect to work with through a query or mutation. Every GraphQL API starts with defining this data, as this type of strict type definition will give the client more clarity as to what they are asking for and what they can expect in return. Think of this as not only defining the API endpoint, but also defining the exact data and parameters that are tied to that endpoint.
// typeDef.js is the file that contains the type definitions for the GraphQL schema. The type definitions are written in the GraphQL schema language. The type definitions define the data types and the relationships between them. The type definitions also define the queries and mutations that can be performed on the data.
// we will get the gql from the apollo-server-express package and use it to tag the typeDefs string as a GraphQL schema string. This allows the Apollo Server to parse the schema into a GraphQL schema document AST.
const { gql } = require("apollo-server-express");
// the gql function is used to parse the typeDefs string into a GraphQL schema document AST
const typeDefs = gql`
  type Book {
    bookId: ID
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  input bookInput {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
  type Auth {
    token: ID!
    user: User
  }
  type Query {
    me: User
    users: [User]
    user(username: String!): User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookInput: bookInput): User
    deleteBook(_id: String): User
  }
`;

module.exports = typeDefs;
