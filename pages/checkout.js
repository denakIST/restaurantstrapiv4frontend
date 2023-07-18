/* pages/checkout.js */

import React, { useContext } from "react";
import { Row, Col } from "reactstrap";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/checkoutForm";
import AppContext from "../components/context";
import Cart from "../components/cart";
import {Container} from "reactstrap"

function Checkout() {
 
  const { isAuthenticated } = useContext(AppContext);
  const appContext = useContext(AppContext);
  
  
  const stripePromise = loadStripe(
    "pk_test_51NDHn8GAj9Oie2tES8wubsnNzT25huUFrbd57TmsGDAa8xV6bSYmTVUueBsfT7ld9A3STyTGGDnz0Ll4UM53Hed800h9KgZlw4"
  );

  return (
    <Container>
      <Row>
        <h1 style={{ margin: 20 }}>Checkout</h1>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
    </Row>
    </Container>
    
  );
  // }
}
export default Checkout;