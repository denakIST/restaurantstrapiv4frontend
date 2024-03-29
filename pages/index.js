import React, { useState } from "react";
import Cart from "../components/cart"
import {ApolloProvider,ApolloClient,HttpLink, InMemoryCache} from '@apollo/client';
import RestaurantList from '../components/restaurantList';
import { InputGroup, InputGroupAddon, Input, Button } from "reactstrap";
import Router from "next/router";
import AppContext from "../components/context";
import { useContext } from "react";

function Home() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
    //const API_URL = process.env.NEXT_PUBLIC_API_URL;
    var { cart, user } = useContext(AppContext);
    console.log(`URL: ${API_URL}`)
    const [query, setQuery] = useState("");
   
    // Define the timeout value in milliseconds (e.g., 10 seconds)
    const timeoutValue = 10000;
    const link = new HttpLink({
    uri: `${API_URL}/graphql`,
    fetchOptions: {
      timeout: timeoutValue,
    },
  });
    
    const cache = new InMemoryCache()
    //const client = new ApolloClient({ link, cache });

    const client = new ApolloClient({
        link,
        cache,
        onError: (error) => {
            console.error('Apollo Client Error:', error);
        },
        });

    
   // handler for render on button click
   
    const handleClick = () => {
            Router.push('/cartPage');
    }
   
    return (
        <ApolloProvider client={client}>
          <div className="search">
              <h2> Local Restaurants</h2>
                <InputGroup >
                <InputGroupAddon addonType="append"> Search </InputGroupAddon>
                <Input
                    onChange={(e) =>
                    setQuery(e.target.value.toLocaleLowerCase())
                    }
                    value={query}
                />
                </InputGroup><br></br>
            </div>
            <RestaurantList search={query} />
            {(cart.items.length > 0 && user) ? (
                <Button
                    style={{ float: "right", width: 120 }}
                    color="primary" onClick={handleClick}>Go To Cart</Button>
            ) : (null)}
            
        </ApolloProvider>
    );
  }
  export default Home;
  