import { useRouter } from "next/router";
import {gql,useQuery} from '@apollo/client';
import { useState, useContext } from 'react';
import AppContext from "./context";
import Router from "next/router";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Row,
  Col
} from "reactstrap";
  import Link from "next/link";
  import TextTruncate from 'react-text-truncate';
  import { API_URL } from "./auth";

function Dishes({ restId }) {
  //const [restaurantID, setRestaurantID] = useState();
  const { user, addItem } = useContext(AppContext);
  const [isExpanded, setIsExpanded] = useState(false);

const GET_RESTAURANT_DISHES = gql`
  query ($id: ID!) {
    restaurant(id: $id) {
      data {
        id
        attributes {
          name
          dishes {
            data {
              id
              attributes {
                name
                description
                price
                image {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
  
  const router = useRouter();

  const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { id: restId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR here</p>;
  if (!data) return <p>Not found</p>;

  let restaurant = data.restaurant.data.attributes;
  console.log(`restaurantDishes: ${JSON.stringify(restaurant)}`)

  // to expand the body text in CardBody
  const onToggleLines = () => {
    setIsExpanded(!isExpanded)
  };

  if (restId > 0){

    return (
      <>
        {restaurant.dishes.data.map((res) => (
            <Col xs="6" sm="4" style={{ padding: 0 }} key={res.id}>
              <Card style={{ margin: "0 10px" }}>
                <CardImg
                  top={true}
                  style={{ height: 150, width:150 }}
                  src={`${API_URL}${res.attributes.image.data.attributes.url}`}
                />
                <CardBody style={{ height: isExpanded ? 'auto' : 150 }}>
                  <CardTitle>{res.attributes.name} ${res.attributes.price}</CardTitle>
                 
                  {isExpanded ? <CardText>{res.attributes.description}</CardText>
                      : <TextTruncate
                        line={2}
                        truncateText="…"
                        text={res.attributes.description}
                        textTruncateChild={
                          <button className="btn btn-link btn-sm"
                            href=""
                            onClick={() => {
                            setIsExpanded(!isExpanded)
                          }
                          }>more</button>
                        }
                      />
                    }
           
                </CardBody>
                <div className="card-footer">
                  <Button color="info"
                    outline
                    onClick={() => {
                      user ? addItem(res): Router.push("/login")
                    }}
                  >
                    + Add To Cart
                  </Button>
                  
                </div>
              </Card>
            </Col>
          ))}
        </>
        )}
        else{
          return <h1> No Dishes</h1>
        }
    }
    export default Dishes