/* /lib/auth.js */

import { useEffect, useState, useContext } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import axios from "axios";
import AppContext from "./context";
import { Token } from "graphql";

//export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

//validate user information
const validateUserInput = (username, email, password) => {
  const isUsernameValid = (username) => {
    const pattern = /^[A-Za-z]+$/;
    return pattern.test(username);
  };

  const isEmailValid = (email) => {
    const pattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return pattern.test(email);
  };

  const isPasswordValid = (password) => {
    const pattern = /^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/;
    return pattern.test(password);
  };

  let valid = true;

  if (!isUsernameValid(username)) {
    valid = false;
  }
  if (!isEmailValid(email)) {
    valid = false;
  }
  if (!isPasswordValid(password)) {
    valid = false;
  }

  return valid;
};


//register a new user
export const registerUser = (username, email, password) => {
  //prevent function from being ran on the server
  if (typeof window === "undefined") {
    return;
  }
 
  return new Promise((resolve, reject) => {
    if (validateUserInput(username,email,password)) {
      axios
        .post(`${API_URL}api/auth/local/register`, { username, email, password })
        .then((res) => {
          //set token response from Strapi for server validation
          Cookie.set("token", res.data.jwt, { expires: 365 }); //Set to persist for 365 days
          console.log(`jwt token after register: ${res.data.jwt}`)

          //resolve the promise to set loading to false in SignUp form
          resolve(res);
          
          //redirect back to home page for restaurance selection
          Router.push("/");
        })
        .catch((error) => {
          if (error.response && error.response.status == 409) {
            // Redirect to login page if user already exists.
            Router.push("/login");
          } else {
            //reject the promise and pass the error object back to the form
            reject(error);
          }
        });
    } else {
      reject(new Error("Invalid username, email or password"));
    }
  });
};





//registered user login

export const login = (identifier, password) => {
  //prevent function from being ran on the server
  if (typeof window === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}api/auth/local/`, { identifier, password })
      .then((res) => {
        //set token response from Strapi for server validation
        Cookie.set("token", res.data.jwt, { expires: 365 }); //Set to persist for 365 days
        console.log(`jwt token after login: ${res.data.jwt}`);
        //resolve the promise to set loading to false in SignUp form
        resolve(res);
        console.log(`res after login auth: ${JSON.stringify(res)}`);
        //redirect back to home page for restaurance selection
        Router.push("/");
      })
      .catch((error) => {
        //reject the promise and pass the error object back to the form
        reject(error);
      });
  });
};


export const logout = () => {
  //remove token and user cookie
  Cookie.remove("token");
  delete window.__user;
  // sync logout between multiple windows
  window.localStorage.setItem("logout", Date.now());
  //redirect to the home page
  Router.push("/");
};


//Higher Order Component to wrap our pages and logout simultaneously logged in tabs
// THIS IS NOT USED in the tutorial, only provided if you wanted to implement
export const withAuthSync = (Component) => {
  const Wrapper = (props) => {
    const syncLogout = (event) => {
      if (event.key === "logout") {
        Router.push("/login");
      }
    };

    useEffect(() => {
      window.addEventListener("storage", syncLogout);

      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem("logout");
      };
    }, []);

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Wrapper.getInitialProps = Component.getInitialProps;
  }

  return Wrapper;
};
