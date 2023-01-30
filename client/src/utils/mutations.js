//Mutations: Mutations are how we perform POST, PUT, and DELETE requests to create or manipulate data through a GraphQL API.

/**
 * LOGIN_USER will execute the loginUser mutation set up using Apollo Server.

ADD_USER will execute the addUser mutation.

SAVE_BOOK will execute the saveBook mutation.

REMOVE_BOOK will execute the removeBook mutation.
 */

import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($input: bookInput) {
    saveBook(bookInput: $input) {
      username
      bookCount
      savedBooks {
        title
        authors
        description
        image
        link
        bookId
      }
    }
  }
`;
//https://www.apollographql.com/docs/react/data/mutations/
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    deleteBook(bookId: $bookId) {
      username
      bookCount
      savedBooks {
        title
        authors
        description
        image
        link
        bookId
      }
    }
  }
`;

