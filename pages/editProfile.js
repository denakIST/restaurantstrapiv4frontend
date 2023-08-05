import React from "react";
import Router from "next/router";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
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
//import { updateUserProfile } from "../components/auth";
import Cookie from "js-cookie";
import { logout } from "../components/auth";
import { API_URL } from "../components/auth";

//export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

function EditProfile(props) {
    const appContext = useContext(AppContext);
    var { user, setUser, authToken, setAuthToken } = useContext(AppContext);
    const [data, setData] = useState({ email: "", username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const router = useRouter();

    

    //var userID = user.id;  
    console.log(`user: ${JSON.stringify(appContext.user)}`);
    console.log(`token: ${appContext.authToken}`);

    

    const updateUserProfile = async (userId, token, username, email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
        method: 'PUT',
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        })
      });
      const res = await response.json();
      //appContext.setUser(res);
        console.log(`data from fetchUpdateUser ${JSON.stringify(res)}`);
        
    } catch (error) {
      console.error(error);
      //message.error("Error While Getting Logged In User Details");
    } finally {
      setLoading(false);
    }
  };

        return (
            <Container>
                <Card>
                    <CardBody>
                        <CardTitle tag="h5" style={{ justifyContentContent: "center" }}>
                            Edit Your Profile Information
                        </CardTitle>
                    </CardBody>
                    <CardBody>
                        <ListGroup flush>
                            <ListGroupItem>
                                <Label>Username</Label>
                                <Input onChange={(e) =>
                                    setData({ ...data, username: e.target.value })}
                                    value={data.username}
                                    name="username">
                                </Input>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Label>Email</Label>
                                <Input onChange={(e) =>
                                    setData({ ...data, email: e.target.value })}
                                    value={data.email}                                    
                                    name="email">
                                </Input>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Label>Password</Label>
                                <Input onChange={(e) =>
                                    setData({ ...data, password: e.target.value })}
                                    value={data.password}                                    
                                    name="password">
                                </Input>
                            </ListGroupItem>
                            <Button
                                style={{ float: "right", width: 120 }}
                                color="primary"
                                disabled={loading}
                                onClick={() => {
                                    setLoading(true);                                    
                                    updateUserProfile(appContext.user.id, appContext.authToken, data.username, data.email, data.password)
                                        .then((res) => {
                                            // set authed user in global context object
                                            appContext.setUser(res);
                                            alert(`You have updated your profile. You need to re-login with your new information.`)
                                            setLoading(false);
                                            console.log(`updated user profile: ${JSON.stringify(res)}`)
                                        })
                                        .catch((error) => {
                                            console.log(`error in updateUserProfile: ${error}`)
                                            //setError(error.response.data);
                                            setLoading(false);
                                        });
                                    logout();
                                    
                                    setData({ email: "", username: "", password: "" })
                                    
                                    
                                }}
                            >
                                {loading ? "Loading.." : "Submit"}
                            </Button>
                        
                        </ListGroup>
                    </CardBody>
                </Card>
            </Container>
        )
};
    
export default EditProfile;