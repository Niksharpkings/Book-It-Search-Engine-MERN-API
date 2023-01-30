import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Auth from "../utils/auth";

//* import useMutation hook from @apollo/client to execute the ADD_USER mutation in the handleFormSubmit function
import { useMutation } from "@apollo/client";

//* import ADD_USER mutation
import { ADD_USER } from "../utils/mutations";

const SignupForm = () => {
  //* use useMutation() hook to execute the ADD_USER mutation in the handleFormSubmit function instead of the loginUser() function you're used to seeing in every Auth example
  const [signup, { error }] = useMutation(ADD_USER);
  // set initial form state for sign up, userformdata is the state, setuserformdata is the function to update the state and set it to the initial state
  const [userFormData, setUserFormData] = useState({});

  // set state for form validation
  const [validated] = useState(false);
  // set state for alert message to appear/disappear when needed
  const [showAlert, setShowAlert] = useState(false);

  // update state based on form input changes ('https://reactjs.org/docs/forms.html') and https://reactjs.org/docs/forms.html#controlled-components and https://developer.mozilla.org/en-US/docs/Web/API/Event/target and https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement and https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/name and https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/value and https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault and https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget and https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget/form and https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements and https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements/name and https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements/name/value and https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements/name/value/trim and https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements/name/value/trim/length
  const handleInputChange = (event) => {
    // destructure name and value from event.target so we can use it for handling change in the form
    const { name, value } = event.target;
    // update state for each input field for this.state. ...userFormData is the spread operator that copies the current state of the userFormData object and then we update the state for the name property with the value of the input field
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // check validity of form data upon submission and display alert if invalid data is entered
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      // execute addUser mutation and pass in variable data from form and log user in upon completion
      const { data } = await signup({
        // we assign the variables property to an object to the spread operated userFormData that contains the key/value pairs for the data we want to pass to the mutation as arguments.
        variables: { ...userFormData },
      });
      // saves the token to local storage and redirects the user to the homepage upon successful signup
      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
      // set error message to display if there is an error
      setShowAlert(true);
    }
    // setUSerFormData resets the form
    setUserFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <>
      {/* https://react-bootstrap.github.io/ */}
      <Form
        noValidate // this is a react-bootstrap prop that disables the default html validation
        validated={validated} // this is a react-bootstrap prop that enables form validation
        //this is a react-bootstrap prop that handles form submission
        onSubmit={handleFormSubmit}
      >
        {/* this is a react-bootstrap component that displays an alert if the form submission is invalid */}
        <Alert
          dismissible // this is a react-bootstrap prop that allows the alert to be dismissed
          onClose={() => setShowAlert(false)} // this is a react-bootstrap prop that handles closing the alert
          show={showAlert} // this is a react-bootstrap prop that controls the alert's visibility
          variant="danger"
        >
          {" "}
          {/* this is a react-bootstrap prop that sets the alert's color scheme */}
          Something went wrong with your signup!
        </Alert>

        <Form.Group>
          <Form.Label htmlFor="username">
            {" "}
            {/*  "htmlFor" attribute react-bootstrap is for  property sets or returns the value of the for attribute ofa form element a label that is it bound to */}
            Username
          </Form.Label>
          <Form.Control
            type="text" // this  prop that sets the input type to text
            placeholder="Your username" // this prop that sets the input's placeholder text to "Your username"
            name="username" // this prop that sets the input's name attribute to username (this is important for form validation)
            onChange={handleInputChange} // this prop that handles updating component state when the input value changes (this is important for form validation)
            value={userFormData.username} // this prop that sets the input's value attribute to the value of userFormData.username in state
            required // this  prop that sets the input as required and displays the browser's native HTML5 validation message if the input is empty upon submission of the form
          />
          <Form.Control.Feedback type="invalid">
            Username is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email} // this prop that sets the input's value attribute to the value of userFormData.email
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password} // this prop that sets the input's value attribute to the value of userFormData.password in state which
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={
            !(
              userFormData.username &&
              userFormData.email &&
              userFormData.password
            )
          } // this prop that disables the button if the user has not entered a username, email, and password
          type="submit" // this prop that sets the button type to submit
          variant="success"
        >
          Submit
        </Button>
      </Form>
      {error && <div>Sign up failed</div>}{" "}
      {/*this component that displays an alert if the form submission is invalid*/}
    </>
  );
};

export default SignupForm;
