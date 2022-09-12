import React, { useState, useEffect } from "react";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Auth from "../utils/auth";
import { saveBook, searchGoogleBooks } from "../utils/API";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

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

      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container fluid="true">
      <Row className="justify-content-md-center text-light bg-dark">
        <Col xs={12} md={8}>
          <Form onSubmit={handleFormSubmit}>
            <Stack gap={3}>
              <Form.Label>
                <h1 className="text-center">📚 Search for Books! 📚</h1>
              </Form.Label>
              <Form.Group>
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
        </Col>
      </Row>
      <br />
      <br />
      <h1 className="text-center">^^^^^^^^^^^^^^^^^^^</h1>
      <h2 className="text-center">
        {searchedBooks.length
          ? ` Viewing (${searchedBooks.length}) results:`
          : "Enter A Book To Search For Above To Begin"}
      </h2>
      <br />
      <div className="card-container">
        {searchedBooks.map((book) => {
          return (
            <Card
              key={book.bookId}
              className="card"
              border="dark"
              style={{
                outline: "1px solid black",
                width: "18rem",
              }}
            >
              <Card.Header className="card-header" as="h3">
                📖{book.title}
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
                <Card.Title
                  style={{
                    backgroundColor: "lightgray",
                    textAlign: "left",
                    color: "black",
                    padding: "10px",
                    textShadow:
                      "1px 1px 1px green, 0 0 1px purple, 0 0 1px darkblue",
                  }}
                  className="DescriptionHeader"
                >
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
  );
};

export default SearchBooks;
