import { gql, useQuery } from '@apollo/client';
import React, { useContext, useState } from 'react';
import AppContext from "./context"
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Container,
  Row,
  Col,
  CardFooter
} from "reactstrap";


function OrderList(props, {userId}) {
 //   var appContext = useContext(AppContext);
 //   let user = appContext.user;
 //   let userId = user.id;

const GET_USER_ORDERS = gql`
  query($id: ID!) {
    user(id: $id) {
      id
      username
      orders {
        id
        address
        amount
        dishes {
            id
            name
            description
            price
        }
      }
    }
  }
`;

//const router = useRouter();
    
    const { loading, error, data } = useQuery(GET_USER_ORDERS, {
        variables: { id: userId }
    });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR here</p>;
  if (!data) return <p>Not found</p>;
    
 let pastOrders = data.user;

    const ordersList = pastOrders.map((ord) => (
        <Col xs="6" sm="4" style={{ padding: 0 }} key={ord.id}>
            <Card style={{ margin: "0 10px" }}>
                <CardTitle>Order#: {ord.id}</CardTitle>
                <CardBody>
                    <>
                    {ord.dishes.map((dish) => (
                        <CardText>{dish.name} {dish.price}</CardText>
                    ))}
                    </>
                </CardBody>
                <CardFooter>Order Total: {ord.amount}</CardFooter>
            </Card>
        </Col>
    ));
    return (

          <Container>                     
                   <Row xs='3'>
                       {ordersList}
                   </Row>                              
            </Container>
      )
    
           
    
};



