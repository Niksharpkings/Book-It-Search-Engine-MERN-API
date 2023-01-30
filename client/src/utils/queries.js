//queries.js: This will hold the query GET_ME, which will execute the me query set up using Apollo Server.
//Queries: Queries are how we perform GET requests and ask for data from a GraphQL API.
import { gql } from "@apollo/client";
export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        author
        title
        description
        image
        link
      }
    }
  }
`;

export const QUERY_ME_BASIC = gql`
  {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        author
        title
        description
        image
        link
      }
    }
  }
`;

export const QUERY_BOOKS = gql`
  query getBooks($bookId: ID) {
    books(bookId: $bookId) {
      bookId
      author
      title
      description
      image
      link
    }
  }
`;
