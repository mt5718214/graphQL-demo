import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";

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

  type Mutation {
    addTodo(title: String!, description: String): Todo
    toggleCompleted(id: ID!): Todo
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Todo: {
    description: (parent, args, context) => {
      if (!parent.description) {
        return "no description";
      }
      return parent.description;
    },
  },
  Query: {
    hello: () => "world",
    getTodoList: () => {
      return todoList;
    },
    getTodo: (root, args, context) => {
      const { id } = args;
      // const { token } = context;
      // console.log(token);
      return todoList.find((todo) => todo.id === Number(id));
    },
  },
  Mutation: {
    addTodo: (_root, args, _context) => {
      const { title, description } = args;
      todoList.push({
        id: todoList.length + 1,
        title,
        description,
        completed: false,
      });

      return todoList[todoList.length - 1];
    },
    toggleCompleted: (_root, args, _context) => {
      const { id } = args;
      const todo = todoList.find((todo) => todo.id === Number(id));
      todo.completed = !todo.completed;

      return todo;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  // Note: This example uses the `req` argument to access headers,
  // but the arguments received by `context` vary by integration.
  // This means they vary for Express, Fastify, Lambda, etc.

  // For `startStandaloneServer`, the `req` and `res` objects are
  // `http.IncomingMessage` and `http.ServerResponse` types.
  context: async ({ req, res }) => {
    // Get the user token from the headers.
    const token = req.headers?.authorization?.split(" ")[1] || "";
    console.log("token", token);
    // Try to retrieve a user with the token
    // const user = await getUser(token);
    if (!token) {
      console.log("throw graphqlerror");
      throw new GraphQLError("User is not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    // Add the user to the context
    return { token };
  },
});
console.log(`🚀 Server ready at ${url}`);
