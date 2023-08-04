import { gql, useQuery } from '@apollo/client';
import React, { useContext, useState, useEffect } from 'react';
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


function OrderList(props) {
  var appContext = useContext(AppContext);
 //let user = appContext.user;
 //let userId = user.id;
  const [orders, setOrders] = useState({ data: [] });
  //const [loading, setLoading] = useState(false);

const GET_USER_ORDERS = gql`
  
 query($userId: ID!) {
      orders (filters: { user:{id : { eq: $userId }}} ){
        data {
          id
          attributes {
            address
            city
            state
            dishes 
          }    
        }
      }
  } 
  `
    
    const { loading, error, data } = useQuery(GET_USER_ORDERS, {
      variables: { userId: appContext.user.id },
       client: appContext.client, // Use the same client instance from appContext
    });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR here</p>;
  if (!data) return <p>Not found</p>;
    
  //let pastOrders = data.user;
  //console.log(`orders: ${pastOrders}`)

  useEffect(() => {
    if (data && data.orders) {
      setOrders(data.orders);
    }
  }, [data]);

  const ordersList = Array.isArray(orders.data)
    ? orders.data.map((ord) => (
      <Col xs="6" sm="4" style={{ padding: 10 }} key={ord.id}>
        <Card style={{ margin: "0 10px" }}>
            <CardHeader>
                <h5>
                      Order#: {ord.id}
                </h5>
                  <a>
                      
                      {moment(ord.created_at).format('MM/DD/YYYY')} at {moment(ord.created_at).format('hh:mm a z')}
                </a>
                    
            </CardHeader>
            <CardBody>
                <>
                      {ord.attributes.dishes.map((dish) => (
                        <CardText key={dish.id}>{dish.attributes.name} ${dish.attributes.price}<br/> quantity: {dish.quantity}</CardText>
                    ))}
                </>
            </CardBody>
            <CardFooter>Order Total: ${ord.attributes.amount}</CardFooter>
        </Card>
    </Col>
    ))
    : null; // or some fallback value if you want to handle it differently
  
    return (

          <Container>                     
                   <Row xs='3'>
                       {ordersList}
                   </Row>                              
            </Container>
      )         
    
};

export default OrderList;



