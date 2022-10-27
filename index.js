var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);

// The root provides a resolver function for each API endpoint
var root = {
  restaurant: (arg) => {
    let index = restaurants.findIndex(restaurant => restaurant.id === arg.id);
    return restaurants[index];
  },
  restaurants: () => {
    return restaurants;
  },
  setrestaurant: ({ input }) => {
    let newID = restaurants.length + 1;
    let newRestaurant = {id:newID, name:input.name, description:input.description};
    restaurants.push(newRestaurant);
    return newRestaurant;
  },
  deleterestaurant: ({ id }) => {
    let ok = false;
    let index = restaurants.findIndex(restaurant => restaurant.id === id);
    if (index === -1) {
      return {ok};
    } else {
      ok = true;
      console.log(JSON.stringify(restaurants[index]));
      restaurants.splice(index, 1);
      return {ok};
    }
  },
  editrestaurant: ({ id, name }) => {
    let index = restaurants.findIndex(restaurant => restaurant.id === id);
    if (index === -1) {
      console.log('Id not found.');
      return "ID not found.";
    }
    restaurants[index].name = name;
    return restaurants[index];
  },
};

var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

//export default root;