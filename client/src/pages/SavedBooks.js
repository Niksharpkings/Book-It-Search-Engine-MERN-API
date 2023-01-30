// import React,  useState and useEffect from 'react' to use the React library and its features //https://reactjs.org/docs/hooks-state.html
import React, { useState, useEffect } from "react";
// import button, card from react-bootstrap https://react-bootstrap.github.io/components/cards/ and https://react-bootstrap.github.io/components/buttons/
import { Button, Card } from "react-bootstrap";
import Auth from "../utils/auth";
import { getMe, deleteBook } from "../utils/API";
//* local storage functions to save bookId's for deletion and to get bookId's for rendering saved books on the page //https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
import { removeBookId } from "../utils/localStorage";
//* use the useMutation hook to execute the REMOVE_BOOK mutation in the handleDeleteBook() function instead of the removeBook() function //https://reactjs.org/docs/hooks-reference.html#usemutation and https://www.apollographql.com/docs/react/data/mutations/
//* use the useQuery hook to execute the GET_ME query on load and save it to a variable named userData //https://reactjs.org/docs/hooks-reference.html#usequery and https://www.apollographql.com/docs/react/data/queries/
// import { useMutation, useQuery } from "@apollo/client";
//* import the GET_ME query and the REMOVE_BOOK mutation //https://www.apollographql.com/docs/react/data/mutations/ and https://www.apollographql.com/docs/react/data/queries/
// import { REMOVE_BOOK } from "../utils/mutations";
// import { GET_ME } from "../utils/queries";

// define the SavedBooks component and export it to be used in other files //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
const SavedBooks = () => {
  // use the useQuery hook to make a query request and save the resulting data to a variable named userData //https://reactjs.org/docs/hooks-reference.html#usequery and https://www.apollographql.com/docs/react/data/queries/
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    bookCount: 0,
    savedBooks: [],
  });
  const userDataLength = Object.keys(userData).length;
  // use the useMutation hook to make a mutation request and save the resulting data to a variable named removeBook //https://reactjs.org/docs/hooks-reference.html#usemutation and https://www.apollographql.com/docs/react/data/mutations/
  //* use the useEffect hook to save book data to state upon component load and set up our useEffect() hook's functionality //https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        const response = await getMe(token);

        if (!response.ok) {
          throw new Error("something went wrong!");
        }

        const user = await response.json();
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await deleteBook(bookId, token);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <div fluid="true" className="card-container text-light bg-dark">
      <>
        <h2 className="text-center" style={{ fontFamily: "fantasy", fontSize: "3rem" }}>
          Viewing {userData.savedBooks.length} saved{" "} {userData.savedBooks.length === 1 ? "book" : "books"} : 'You have no saved books!{" "}
        </h2>
        {/* {userData.savedBooks.length ? `Viewing ${userData.savedBooks.length} saved $(userData.savedBooks.length === 1  ? 'book' : 'books'}` : 'You have no saved books!'} */}
      </>
      <div className="card-container text-light bg-dark">
        {userData.savedBooks.map((book) => {
          return (
            <Card key={book.bookId} border="dark" className="card">
              <Card.Header className="card-header">📖{book.title}</Card.Header>
              {book.image ? (
                <Card.Img className="images" src={book.image} alt={`The cover for ${book.title}`} variant="top" />
              ) : null}
              <Card.Body>
                <p className="author">
                  &nbsp;📝Author(s):
                  {book.authors}
                </p>
                <Card.Text className="description">
                  {book.description}
                </Card.Text>
                <Button
                  className="btn-block btn-danger"
                  onClick={() => handleDeleteBook(book.bookId)}
                >
                  Delete this Book!
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SavedBooks;
