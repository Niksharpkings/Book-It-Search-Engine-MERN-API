//Resolvers: Resolvers are simply the functions we connect to each query or mutation type definition that perform the CRUD actions that each query or mutation is expected to perform.
// resolvers for the queries and mutations that will be sent to the Apollo server from the front end (client) using the Apollo Provider (ApolloClient) and the useMutation() and useQuery() hooks in the components that need to make queries and mutations to the server.
// retrieve the authenticationError for the apollo server express
const { AuthenticationError } = require("apollo-server-express");
// import the user model from the models folder (server\models\index.js) and the signToken function from the auth file (server\utils\auth.js) in the utils folder (server\utils\index.js)
const { User, Book } = require("../models");
// the signToken function is used to sign the token for the user
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne(
          {
            _id: context.user._id
          }
        )
          .select("-__v -password")
          .populate("savedBooks");
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
    users: async () => {
      return User.find()
        .select("-__v -password")
        .populate("savedBooks");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("savedBooks");
    },
    book: async (parent, { _id }) => {
      return Book.findOne({ _id })
    },
  },
  Mutation: {
    // add a user
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    // login a user
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Oh No! Incorrect credentials");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Oh No!! Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    // save a book
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    // remove a book
    deleteBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

//             if(!context.user) {
//                 throw new AuthenticationError('Must be signed in.')
//             }
//             const updatedUser = await User.findOneAndUpdate(
//                 { _id: context.user._id },
//                 { $addToSet: { savedBooks: args.bookInput }},
//                 { new: true,  runValidators: true}
//             );
//             return updatedUser
//         },
//     // remove a book
//     deleteBook: async (parent, { _id }, context) => {
//       if(!context.user) {
//           throw new AuthenticationError('Must be logged in.')
//       }
//       const updatedUser = await User.findOndAndUpdate(
//           { _id: context.user._id },
//           { $pull: { savedBooks: { bookId: _id } } },
//           { new: true }
//       );
//       if(!updatedUser) {
//           throw new AuthenticationError('User not found.')
//       }
//       return updatedUser;
//     },
//   },
// };


module.exports = resolvers;
