import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Auth from "../utils/auth";

//* useMutation hook is used to execute the LOGIN_USER mutation in the handleFormSubmit() function instead of the loginUser() function imported from the Auth object. The loginUser() function is still imported, but it's not being used anymore.
import { useMutation } from "@apollo/client";
//* The SignupForm component is updated to use the useMutation() Hook to execute the ADD_USER mutation in the handleFormSubmit() function instead of the addUser() function imported from the Auth object. The addUser() function is still imported, but it's not being used anymore.
import { LOGIN_USER } from "../utils/mutations";

// update the SignupForm component to accept props so that it can redirect the user to the homepage after they've successfully signed up for an account
const LoginForm = () => {
  // set initial form state for sign up, userformdata is the state, setuserformdata is the function to update the state and set it to the initial state
  const [userFormData, setUserFormData] = useState({ email: "", password: "" });
  const [login, { error }] = useMutation(LOGIN_USER);
  // set state for form validation
  const [validated] = useState(false);
  // set state for alert message to appear/disappear when needed
  const [showAlert, setShowAlert] = useState(false);

  //* use useMutation() hook to execute the LOGIN_USER mutation in the handleFormSubmit function instead of the loginUser() function you're used to seeing in every Auth example

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  //* update handleFormSubmit() to accept the event parameter and use the login() mutation function instead of the loginUser() function imported from the Auth object to execute the LOGIN_USER mutation in the handleFormSubmit() function instead of the addUser() function imported from the Auth object. The addUser() function is still imported, but it's not being used anymore.
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check validity of form data upon submission and display alert if invalid data is entered
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      //* execute addUser mutation and pass in variable data from form and log user in upon completion
      const { data } = await login({
        // we assign the variables property to an object to the spread operated userFormData that contains the key/value pairs for the data we want to pass to the mutation as arguments.
        variables: { ...userFormData },
      });
      // use the token returned from the mutation response to log the user in
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
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
        noValidate // this is to disable the browser default validation
        validated={validated} // this is to enable the custom validation
        onSubmit={handleFormSubmit}
        className="login-form p-3 mb-2 bg-dark text-light"
        style={{
          margin: "0 auto",
          border: "1px solid #00e1ff",
          borderRadius: "5px",
          boxShadow: "0 0 10px #00ff4c",
        }}
      >
        {" "}
        {/* this is to handle the form submission */}
        <Alert
          dismissible // this is to enable the close button
          onClose={() => setShowAlert(false)} // this is to enable the close button
          show={showAlert} // this is to enable the close button
          variant="danger"
        >
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className="mb-3" bg="dark">
          <Form.Label htmlFor="email">
            {" "}
            {/* htmlFor in the JSX code for the label element in the form below set for email */}
            Email
          </Form.Label>
          <Form.Control
            bg="dark"
            type="email" // this is to set the input type to text
            placeholder="Enter Your Login Email Here" // this is to set the placeholder text for the input element set for email
            className="email" // this is to set the name attribute for the input element set for email
            onChange={handleInputChange} // this is to handle the input change for the input element set for email and update the state accordingly with the new value for the email property in the userFormData object in the state
            value={userFormData.email} // this is to set the value of the input element set for email to the value of the email property in the userFormData object in the state
            required // this is to set the input element set for email to be required and display the custom validation message set below if the input element is empty
          />
          <Form.Control.Feedback type="invalid">
            {" "}
            {/* this is to set the feedback type to invalid */}
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Your Login Password Here"
            className="password"
            onChange={handleInputChange}
            value={userFormData.password} // this is to set the value of the input element set for password to the value of the password property in the userFormData object in the state
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)} // this is to disable the button if the email and password properties in the userFormData object in the state are empty
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
      {error && <div>Sign up failed</div>}{" "}
    </>
  );
};

export default LoginForm;
