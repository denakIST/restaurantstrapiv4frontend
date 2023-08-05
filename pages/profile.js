import React from "react";
import { useContext, useState } from "react";
import AppContext from "../components/context";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardText,
    CardLink,
    ListGroup,
    ListGroupItem,
    Label,
    Input,
    Button
} from "reactstrap";
import { updateUserProfile } from "../components/auth";

function Profile(props) {
    var { user, cart } = useContext(AppContext);
    const [data, setData] = useState({ email: "", username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    return (

        <Container>
            <Card>
                <CardBody>
                    <CardTitle tag="h5" style={{ justifyContentContent: "center" }}>Your Profile Information </CardTitle>
                </CardBody>
                <CardBody>
                    <ListGroup flush>
                        <ListGroupItem>
                                <Label>Username</Label>
                                <Input readOnly value={user.username}/>
                        </ListGroupItem>
                        
                        <ListGroupItem>
                                <Label>Email</Label>
                                <Input readOnly value={user.email}/>
                        </ListGroupItem>

                        <ListGroupItem>
                                <Label>Password</Label>
                                <Input readOnly value={user.password}/>
                        </ListGroupItem>
                        
                    </ListGroup>
                </CardBody>
                <CardBody>
                            
                    <CardLink href="/editProfile">Edit Profile</CardLink>
                </CardBody>
            </Card>
        </Container>

                    
                
                )
            }

export default Profile;