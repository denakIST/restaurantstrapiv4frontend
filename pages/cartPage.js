import Cart from "../components/cart"
import React from "react";

import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

function ReturnCart(props) {
  return (<Container>
      <Col>
        <Cart/>
      </Col>     
    </Container>)
  }
  
export default ReturnCart;