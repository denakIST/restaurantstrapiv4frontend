import { gql, useQuery } from '@apollo/client';
import Dishes from "./dishes"
import { useContext, useState } from 'react';
import { API_URL } from "./auth";


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
  Col
} from "reactstrap";


import TextTruncate from 'react-text-truncate';


function RestaurantList(props) {
  const [restaurantID, setRestaurantID] = useState(0);
  const [expandedRestaurantID, setExpandedRestaurantID] = useState(null);
  const { cart } = useContext(AppContext);
  const [state, setState] = useState(cart);

  const GET_RESTAURANTS = gql`
    {
      restaurants {
        data {
          id
          attributes {
            name
            description
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
  `;

  const { loading, error, data } = useQuery(GET_RESTAURANTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  let searchQuery = data.restaurants.data.filter((res) => {
    return (
      res.attributes.name.toLowerCase().includes(props.search) ||
      res.attributes.description.toLowerCase().includes(props.search)
    );
  }) || [];

  let restId = searchQuery[0] ? searchQuery[0].id : null;

  // Define renderer for Dishes
  const renderDishes = (restaurantID) => {
    return (<Dishes restId={restaurantID} />);
  };

  // Function to toggle restaurant description expansion
  const onToggleLines = (restaurantID) => {
    setExpandedRestaurantID((prevState) => (prevState === restaurantID ? null : restaurantID));
  };

  if (searchQuery.length > 0) {
    const restList = searchQuery.map((res) => (
      <Col xs="6" sm="4" key={res.id}>
        <Card style={{ margin: "0 0.5rem 20px 0.5rem" }}>
          <CardImg
            top={true}
            style={{ height: 200 }}
            src={`${res.attributes.image.data.attributes.url}`}
          />
          <CardBody>
            {expandedRestaurantID === res.id ? (
              <CardText>{res.attributes.description}</CardText>
            ) : (
              <TextTruncate
                line={2}
                truncateText="..."
                text={res.attributes.description}
                textTruncateChild={
                  <Button
                    color="link"
                    size="sm"
                    onClick={() => onToggleLines(res.id)}
                  >
                  Read more
                  </Button>
                }
              />
            )}
          </CardBody>
          <div className="card-footer">
            <Button
              color="info"
              onClick={() => setRestaurantID(res.id)}
            >
              {res.attributes.name}
            </Button>
          </div>
        </Card>
      </Col>
    ));

    return (
      <Container>
        {restaurantID ? (
          <Row xs='3'>
            {renderDishes(restaurantID)}
          </Row>
        ) : (
          <Row xs='3'>
            {restList}
          </Row>
        )}
      </Container>
    );
  } else {
    return <h1> No Restaurants Found</h1>;
  }
}

export default RestaurantList;
