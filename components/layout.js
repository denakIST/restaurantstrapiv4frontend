/* /components/Layout.js */

import React, { useContext, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, DropdownLink } from "reactstrap";
import AppContext from "./context";
//import { AppComponent } from "./auth";
import { logout } from "./auth";
import OrderList from "./orderList";

const Layout = (props) => {
const title = "Welcome to Nextjs";
  const { cart, user, setUser } = useContext(AppContext);
  const { authToken, setAuthToken } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);

  
  console.log(`user after registration from context ${JSON.stringify({ user })}`);
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
        <script src="https://js.stripe.com/v3" />
      </Head>
      <header>
        <style jsx>
          {`
            a {
              color: white;
            }
            h5 {
              color: white;
              padding-top: 11px;
            }
          `}
        </style>
        <Nav className="navbar navbar-dark bg-dark">
          <NavItem>
            <Link href="/">
              <a
                className="navbar-brand"
                onClick={()=>{
                  push('/')
                }}
              >
                Home</a>
            </Link>
          </NavItem>
          
          <NavItem className="ml-auto">
            {user ? (
              <Link href="/cartPage">
                <a className="nav-link">
                  <span className="d-inline-block">
                    <img className="svg-cart-item" src='/shopping_bag.svg' alt="" />
                    <span className="badge badge-pill badge-primary" style={{ position: "relative", top: "0px", right: "20px" }}>{cart.items.length}</span>
                  </span>
                </a>
              </Link>
            ) : (null)}
          </NavItem>

          <div className="nav-item" >
            {user ? (              
              <Dropdown nav isOpen={ dropdownOpen } toggle={toggle }>
                  <DropdownToggle nav caret style={{ color: "white" }}>
                    {user.username}                  
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem href="/profile">My Profile</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem href="/orders">My Orders</DropdownItem>             
                </DropdownMenu>
              </Dropdown>         
            ) : (
              <Link href="/register">
                <a className="nav-link"> Sign up</a>
              </Link>
            )}
          </div>
          <NavItem>
            {user ? (
              <Link href="">
                <a
                  className="nav-link"
                  onClick={async () => {
                    await logout();
                    setUser(false);
                    setAuthToken(false);        
                  }}
                >
                  Logout
                </a>
              </Link>
            ) : (
              <Link href="/login">
                <a className="nav-link">Sign in</a>
              </Link>
            )}
          </NavItem>
        </Nav>
      </header>
      <Container>{props.children}</Container>
    </div>
  );
};

export default Layout;