import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import ShortUniqueId from "short-unique-id";
import { getToken, getUserId } from "../auth";
import { Context } from "../context";
import { getPoll, login } from "../controllers";

const JWT_SECRET = process.env.JWT_SECRET;
const uid = new ShortUniqueId({ length: 10 });

export default {
  Query: {
    user: (_parent, args, context: Context) => {
      const token = getToken(context);
      const userId = getUserId(token) || undefined;

      if (!userId) throw new Error("Please login to view this page.");

      return context.prisma.users.findUnique({
        where: { id: userId },
      });
    },
    poll: async (_parent, args: { id: string }, context: Context) => {
      return await getPoll(args.id, context);
    },
  },
  Mutation: {
    signup: async (_parent, args, context: Context) => {
      const { email, name } = args;
      const password = await bcrypt.hash(args.password, 10);

      try {
        const user = await context.prisma.users.create({
          data: { email: email, name: name, password: password },
        });

        const token = jwt.sign({ userId: user.id }, `${JWT_SECRET}`, {
          expiresIn: "1d",
        });

        return {
          token,
          user,
        };
      } catch (err) {
        throw new Error(
          "An account already exists for this email. Please login instead."
        );
      }
    },
    login: async (
      _parent,
      { email, password }: { email: string; password: string },
      context: Context
    ) => {
      const user = await login(email, password, context);

      const token = jwt.sign({ userId: user.id }, `${JWT_SECRET}`, {
        expiresIn: "1d",
      });

      return {
        token,
        user,
      };
    },
    createPoll: (
      _parent,
      args: {
        data: {
          title: string;
          description?: string;
          expDate?: string;
          showResults?: boolean;
        };
      },
      context: Context
    ) =>
      context.prisma.polls.create({
        data: {
          title: args.data.title,
          description: args.data.description,
          expDate: args.data.expDate,
          showResults: args.data.showResults,
          slug: uid() as string,
          owner: {
            // connect: { id: 1 },
            connect: { id: context.userId },
          },
        },
      }),
    updatePoll: (
      _parent,
      args: {
        data: {
          id: number;
          title?: string;
          description?: string;
          expDate?: string;
          showResults?: boolean;
        };
      },
      context: Context
    ) =>
      context.prisma.polls.update({
        where: { id: args.data.id },
        data: {
          title: args.data.title,
          description: args.data.description,
          expDate: args.data.expDate,
          showResults: args.data.showResults,
        },
      }),
    starPoll: (
      _parent,
      args: {
        id: number;
      },
      context: Context
    ) =>
      context.prisma.starredPolls.create({
        data: {
          poll: {
            connect: { id: args.id },
          },
          user: {
            connect: { id: 1 },
          },
        },
      }),
    createPollItem: (
      _parent,
      args: {
        data: {
          pollId: number;
          name: string;
        };
      },
      context: Context
    ) =>
      context.prisma.pollItems.create({
        data: {
          name: args.data.name,
          poll: {
            connect: { id: args.data.pollId },
          },
        },
      }),
    updatePollItem: (
      _parent,
      args: {
        data: {
          id: number;
          name: string;
        };
      },
      context: Context
    ) =>
      context.prisma.pollItems.update({
        where: { id: args.data.id },
        data: {
          name: args.data.name,
        },
      }),
    deletePollItem: (
      _parent,
      args: {
        id: number;
      },
      context: Context
    ) =>
      context.prisma.pollItems.delete({
        where: { id: args.id },
      }),
  },
  User: {
    polls: (_parent, args, context: Context) => {
      return context.prisma.users
        .findUnique({
          where: { id: _parent.id },
        })
        .polls();
    },
    starredPolls: (_parent, args, context: Context) => {
      // if (!context.userId) {
      //   throw new Error("Please login to view your starred polls.");
      // }
      return context.prisma.users
        .findUnique({
          where: { id: _parent.id },
        })
        .starredPolls();
    },
  },
  Poll: {
    items: (_parent, args, context: Context) => {
      return context.prisma.polls
        .findUnique({
          where: { id: _parent.id },
        })
        .items();
    },
  },
};
