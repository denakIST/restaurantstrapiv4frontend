import { useRouter } from "next/router";
import {gql,useQuery} from '@apollo/client';
import { useState, useContext } from 'react';
import AppContext from "./context";
import Router from "next/router";
import { InputGroup, InputGroupAddon, Input } from "reactstrap";
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
  const { user, addItem } = useContext(AppContext);
  const [expandedDishId, setExpandedDishId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Step 1: Add state for search query

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
  console.log(`restaurantDishes: ${JSON.stringify(restaurant)}`);

  const onToggleLines = (dishId) => {
    setExpandedDishId((prevState) => (prevState === dishId ? null : dishId));
  };

  // Step 2: Filter the dishes based on the search query
  const filteredDishes = restaurant.dishes.data.filter(
    (dish) =>
      dish.attributes.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.attributes.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (restId > 0) {
    return (
      <>
        {/* Step 1: Add search input field */}
         <InputGroup>
         <InputGroupAddon addonType="append">
            <Button color="secondary">Search</Button>
          </InputGroupAddon>
          <Input
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Dishes"
          />
        </InputGroup><br></br>
        <div></div>

        {filteredDishes.map((res) => (
          <Col xs="6" sm="4" style={{ padding: 10 }} key={res.id}>
            <Card style={{ margin: "0 0.5rem 20px 0.5rem" }}>
              <CardImg
                top={true}
                style={{ height: 150, width: 100 }}
                src={`${res.attributes.image.data.attributes.url}`}
              />
              <CardBody
                style={{ height: expandedDishId === res.id ? "auto" : 150 }}
              >
                <CardTitle>{res.attributes.name} ${res.attributes.price}</CardTitle>

                {expandedDishId === res.id ? (
                  <CardText>{res.attributes.description}</CardText>
                ) : (
                  <TextTruncate
                    line={2}
                    truncateText="…"
                    text={res.attributes.description}
                    textTruncateChild={
                      <button
                        className="btn btn-link btn-sm"
                        href=""
                        onClick={() => onToggleLines(res.id)}
                      >
                        more
                      </button>
                    }
                  />
                )}
              </CardBody>
              <div className="card-footer">
                <Button
                  color="info"
                  outline
                  onClick={() => {
                    user ? addItem(res) : Router.push("/login");
                  }}
                >
                  + Add To Cart
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </>
    );
  } else {
    return <h1> No Dishes</h1>;
  }
}

export default Dishes;
