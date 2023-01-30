import React, { useState, useEffect } from "react";
import {
  Stack,
  Form,
  Button,
  Card,
  Col,
  Row,
  Container,
} from "react-bootstrap";

import Auth from "../utils/auth";
import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../utils/mutations";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";
import { searchGoogleBooks } from "../utils/API";

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // useMutation hook to execute the SAVE_BOOK mutation in the handleSaveBook() function instead of the saveBook() function //https://reactjs.org/docs/hooks-reference.html#usemutation and https://www.apollographql.com/docs/react/data/mutations/
  const [saveBook, { error }] = useMutation(SAVE_BOOK);
  // create state for holding our search field data so we can control the query to the Google Books API and set it to an empty string to start
  const [searchInput, setSearchInput] = useState("");
  // create state to hold saved bookId values and set it to an empty array to start //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!searchInput) {
      return false;
    }
    try {
      const response = await searchGoogleBooks(searchInput); //= await searchGoogleBooks(searchInput);   //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
      if (!response.ok) {
        throw new Error("Oh NO!! Something went wrong!");
      }
      // destructure the data from the response object to get the books array
      const { items } = await response.json();
      // get the book data we need from the search results and store in a new array to set in state for the savedBooks
      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["No author to display"],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || "",
      }));
      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };
  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    console.log(bookToSave);
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }
    try {
      const response = await saveBook(bookToSave, token);
      if (!response.ok) {
        throw new Error("something went wrong!");
      }
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Container fluid="true">
        <Row className="justify-content-md-center text-light bg-dark">
          <Col xs={12} md={8}>
            <Card>
              <Card.Body>
                <Form onSubmit={handleFormSubmit}>
                  <Stack gap={3}>
                    <Form.Label>
                      <h1 className="text-center">🔎Search for Books!📚</h1>
                    </Form.Label>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Stack direction="horizontal" gap={3}>
                        <Form.Control
                          className="form-control"
                          name="searchInput"
                          type="text"
                          placeholder="🔎 Add the book you want to search for here..."
                          value={searchInput}
                          size="xl"
                          onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <Button type="submit" variant="success" size="sm">
                          🔎📚Search
                        </Button>
                        <br />
                      </Stack>
                      <br />
                      <br />
                    </Form.Group>
                  </Stack>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <h1 className="headings">^^^^^^^^^^^^^^^^^^^</h1>
        <h2 className="text-center">
          {searchedBooks.length
            ? ` Viewing (${searchedBooks.length}) results:`
            : "Enter A Book To Search For Above To Begin"}
        </h2>
        <br />
        <div className="card-container">
          {searchedBooks.map((book) => {
            return (
              <Card key={book.bookId} className="card" border="dark">
                <Card.Header className="card-header" as="h3">
                  {" "}📖{book.title}{" "}
                </Card.Header>
                <div className="card-image">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                      className="images"
                    />
                  ) : null}
                </div>
                <Card.Body>
                  <p className="author">&nbsp;📝Author(s): {book.authors}</p>
                  <Card.Title className="descriptionHeader">
                    &nbsp;🧾 Description:
                  </Card.Title>
                  <Card.Text className="description">
                    {book.description}
                  </Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      className="btn-block btn-info"
                      disabled={savedBookIds?.some(
                        (savedBookId) => savedBookId === book.bookId
                      )}
                      onClick={() => handleSaveBook(book.bookId)}
                    >
                      {savedBookIds?.some(
                        (savedBookId) => savedBookId === book.bookId
                      )
                        ? "This book has already been saved!"
                        : "Save this Book!"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </Container>
      {error && <div>Sign up failed</div>}
    </>
  );
};

export default SearchBooks;
