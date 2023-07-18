/* /context/AppContext.js */

import React from "react";
import { useState } from "react";
// create auth context with default value

// set backup default for isAuthenticated if none is provided in Provider
const AppContext = React.createContext(
    {
        isAuthenticated: true,
        cart: {
            items: [],
            total: 0
        },
        setCart: () => { },
        addItem: () => { },
        removeItem: () => { },
        clearItemsInCart: () => { },
        user: false,
        setUser: () => { },
        authToken: false,
        setAuthToken: ()=>{} 
    });

//const [user, setUser] = AppContext.user;

export default AppContext;