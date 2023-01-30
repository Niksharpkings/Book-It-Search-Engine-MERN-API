// Language: javascript React (JSX)
// Auth.js as a class component for the user to login and signup with the following methods: login, signup, logout, and getProfile

// use this to decode a token and get the user's information out of it
import decode from "jwt-decode";

// create a new class to instantiate Auth objects

class AuthService {
  // get user data from the token
  getProfile() {
    return decode(this.getToken());
  }

  // check if the user is still logged in
  loggedIn() {
    // check if there is a saved token and it's still valid
    const token = this.getToken(); // GEtting token from localStorage
    return !!token && !this.isTokenExpired(token); // handWaiving here
  }

  // check if the token has expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        // Checking if token is expired.
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  // retrieve the token from localStorage
  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  }

  // set the token in localStorage and reload page to homepage
  login(idToken) {
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);
    window.location.assign("/");
  }

  // clear the token and profile data from localStorage and reload page to homepage
  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
    // this will reload the page and reset the state of the application
    window.location.assign("/");
  }

  setToken = (idToken) => {
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);
  };
}
export default new AuthService();
// // get a token from api server using the fetch api
// login = (email, password) => {
//   // Get a token from api server using the fetch api
//   return fetch("/api/users/login", {
//     method: "POST",
//     body: JSON.stringify({
//       email,
//       password
//     }),
//     headers: {
//       "Content-Type": "application/json"
//     }
//   })
//     .then(res => {
//       this.setToken(res.data.token) // Setting the token in localStorage
//       return Promise.resolve(res);
//     })
// }

// class AuthService {
//   // get user data
//   getProfile() {
//     return decode(this.getToken());
//   }

//   // check if user's logged in
//   loggedIn() {
//     // Checks if there is a saved token and it's still valid
//     const token = this.getToken();
//     return !!token && !this.isTokenExpired(token); // handWaiving here
//   }

//   // check if token is expired
//   isTokenExpired(token) {
//     try {
//       const decoded = decode(token);
//       return decoded.exp < Date.now() / 1000 ? true : false;
//     } catch (err) {
//       return false;
//     }
//   }

//   getToken() {
//     // Retrieves the user token from localStorage
//     return localStorage.getItem("id_token");
//   }

//   login(idToken) {
//     // Saves user token to localStorage
//     localStorage.setItem("id_token", idToken);
//     window.location.assign("/");
//   }

//   logout() {
//     // Clear user token and profile data from localStorage
//     localStorage.removeItem("id_token");
//     // this will reload the page and reset the state of the application
//     window.location.assign("/");
//   }
// }

// export default new AuthService();
