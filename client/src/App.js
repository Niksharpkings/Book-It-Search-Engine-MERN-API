import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import Apollo Server to connect to front end
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

//components folder
// import LoginForm from "./components/LoginForm";
// import SignupForm from "./components/SignupForm";
import Navbar from "./components/Navbar";

// page folder
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import NoMatch from "./pages/NoMatch";

const httpLink = createHttpLink({
  uri: "/graphql",
  cache: new InMemoryCache(),
 //! graphql: true
});
console.log("httpLink: ", httpLink);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  console.log("from App.JS token " + token);
  return {
    ...headers,
    authorization: token ? `Bearer ${token}` : "",
  };
});
console.log("authLink", authLink);

// create a new ApolloClient instance and pass in the link option to the constructor, which will be set to the authLink we just created
const client = new ApolloClient({
  //combine the authLink and httpLink objects so that every request retrieves the token and sets the request headers before making the request to the API
  link: authLink.concat(httpLink),
  // / set the cache to a new instance of InMemoryCache
  cache: new InMemoryCache(),
});

export function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<SearchBooks />} />
          <Route path="/saved" element={<SavedBooks />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}


export default App;
