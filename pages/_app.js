
import { useContext, useState, useEffect } from "react";
import Head from "next/head";
import AppContext from "../components/context";
import Home from "./index"
import Layout from "../components/layout"
import Cookie from "js-cookie";
import axios from "axios";
import { API_URL } from "../components/auth";


function MyApp(props) {
  var { cart, addItem, removeItem, clearItemsInCart } = useContext(AppContext);
  const [state, setState] = useState({ cart: cart });
  const [user, setUser] = useState(false);
  const { Component, pageProps } = props;
  
  /////USER PERSISTENCE - FETCH LOGGEDIN USER/////////

  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState(Cookie.get('token'));

  const fetchLoggedInUser = async (token) => {
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
      console.log(`data from fetchLoggedinUser ${JSON.stringify(data)}`);

    } catch (error) {
      console.error(error);
      //message.error("Error While Getting Logged In User Details");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (authToken) {
      fetchLoggedInUser(authToken);
    }
  }, [authToken]);

  ////////////////////////

  addItem = (item) => {
    let { items } = state.cart;
    //check for item already in cart
    //if not in cart, add item if item is found increase quanity ++
    let foundItem = true;
    if (items.length > 0) {
      foundItem = items.find((i) => i.id === item.id);
     
      if (!foundItem) foundItem = false;
    }
    else {
      foundItem = false;
    }
    console.log(`Found Item value: ${JSON.stringify(foundItem)}`)
    // if item is not new, add to cart, set quantity to 1
    if (!foundItem) {
      //set quantity property to 1
    
      let temp = JSON.parse(JSON.stringify(item));
      temp.quantity = 1;
      var newCart = {
        items: [...state.cart.items, temp],
        total: state.cart.total + item.attributes.price,
      }
      setState({ cart: newCart })
      console.log(`Total items: ${JSON.stringify(newCart)}`)
    } else {
      // we already have it so just increase quantity ++
      console.log(`Total so far:  ${state.cart.total}`)
      newCart = {
        items: items.map((item) => {
          if (item.id === foundItem.id) {
            return Object.assign({}, item, { quantity: item.quantity + 1 })
          } else {
            return item;
          }
        }),
        total: state.cart.total + item.attributes.price,
      }
    }
    setState({ cart: newCart });  // problem is this is not updated yet
    console.log(`state reset to cart:${JSON.stringify(state)}`)
     
  };
  removeItem = (item) => {
    let { items } = state.cart;
    //check for item already in cart
    const foundItem = items.find((i) => i.id === item.id);
    if (foundItem.quantity > 1) {
      var newCart = {
        items: items.map((item) => {
          if (item.id === foundItem.id) {
            return Object.assign({}, item, { quantity: item.quantity - 1 })
          } else {
            return item;
          }
        }),
        total: state.cart.total - item.attributes.price,
      }
      //console.log(`NewCart after remove: ${JSON.stringify(newCart)}`)
    } else { // only 1 in the cart so remove the whole item
      console.log(`Try remove item ${JSON.stringify(foundItem)}`)
      const index = items.findIndex((i) => i.id === foundItem.id);
      items.splice(index, 1);
      var newCart = { items: items, total: state.cart.total - item.attributes.price }
    }
    setState({ cart: newCart });
  }
  clearItemsInCart = () => {
    setState({ cart: {items:[], 
            total: 0
        } })
  }

  return (
    <AppContext.Provider value={{ cart: state.cart, addItem: addItem, removeItem: removeItem, clearItemsInCart:clearItemsInCart, isAuthenticated: false, user:user, setUser:setUser, authToken: authToken, setAuthToken:setAuthToken}}>
      <Head>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
      </Head>
    
      <Layout>
          <Component {...props} />
      </Layout>

    </AppContext.Provider>
  );
  
}


export default MyApp;
