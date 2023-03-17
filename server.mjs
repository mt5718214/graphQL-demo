import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const todoList = [
  {
    id: 1,
    title: "learn graphQL",
    description: "123",
    completed: false,
  },
  {
    id: 2,
    title: "todolist2",
    description: "test",
    completed: false,
  },
  {
    id: 3,
    title: "todolist3",
    description: "description3",
    completed: true,
  },
  {
    id: 4,
    title: "todolist4",
    description: "",
    completed: false,
  },
];

// The GraphQL schema
const typeDefs = `#graphql
  "test comment"
  type Query {
    hello: String
    getTodoList: [Todo]
    getTodo(id: String!): Todo
  }

  type Todo {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => "world",
    getTodoList: () => {
      return todoList;
    },
    getTodo: (root, args, context) => {
      const { id } = args;
      console.log(id);
      return todoList.find((todo) => todo.id === Number(id));
    },
  },
  Todo: {
    description: (parent, args, context) => {
      console.log(parent.description);
      if (!parent.description) {
        return "no description";
      }
      return parent.description;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
