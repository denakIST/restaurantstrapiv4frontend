import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import AppContext from "../components/context";
import { API_URL } from "../components/auth";
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
    CardFooter,
    CardHeader,
    CardColumns,
  
} from "reactstrap";

import moment from 'moment';


function Orders(props) {
    const appContext = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    //fetch order data with authorization

    const orderHistory = async (token, userId) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/orders?user=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            });
            const res = await response.json();
            setOrders(res);
            //appContext.setUser(res.data.user);
            console.log(`orderHistory ${JSON.stringify(res)}`);

        } catch (error) {
            console.error(error);
            //message.error("Error While Getting Logged In User Details");
        } finally {
            setLoading(false);
        }
    };

    // useEffect for fetching data only when there is a user and authToken in the appContext
    useEffect(() => {
        if (appContext.user && appContext.authToken) {
            orderHistory(appContext.authToken, appContext.user.id);
        }
    }, [appContext.user, appContext.authToken]);

    
    const ordersList = orders.map((ord) => (
        
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
                    {ord.dishes.map((dish) => (
                        <CardText key={dish.id}>{dish.name} ${dish.price} x {dish.quantity}</CardText>
                    ))}
                </>
            </CardBody>
            <CardFooter>Order Total: ${ord.amount / 100}</CardFooter>
        </Card>
    </Col>
    )
);
   
    return (
        <Container>
            <Row>
                {ordersList}
            </Row>            
        </Container>
    )
              
}

export default Orders