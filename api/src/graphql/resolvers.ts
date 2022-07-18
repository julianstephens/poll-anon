import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import ShortUniqueId from "short-unique-id";
import { Context } from "../context";

const JWT_SECRET = process.env.JWT_SECRET;
const uid = new ShortUniqueId({ length: 10 });

export default {
  Query: {
    user: (_parent, args: { id: number }, context: Context) => {
      return context.prisma.users.findUnique({
        where: { id: args.id },
      });
    },
    poll: (_parent, args: { id: string }, context: Context) => {
      const id = Number(args.id);
      if (!Number.isNaN(id)) {
        return context.prisma.polls.findUnique({
          where: { id: id },
        });
      }
      return context.prisma.polls.findUnique({
        where: { slug: args.id },
      });
    },
  },
  Mutation: {
    signup: async (_parent, args, context: Context) => {
      const { email, name } = args;
      const password = await bcrypt.hash(args.password, 10);

      const user = await context.prisma.users.create({
        data: { email: email, name: name, password: password },
      });

      const token = jwt.sign({ userId: user.id }, `${JWT_SECRET}`, {
        expiresIn: "1y",
      });

      return {
        token,
        user,
      };
    },
    login: async (_parent, args, context: Context) => {
      const { email, password } = args;
      const user = await context.prisma.users.findUnique({ where: { email } });

      if (!user) throw new Error(`No user found for email: ${email}`);

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) throw new Error("Invalid password");

      const token = jwt.sign({ userId: user.id }, `${JWT_SECRET}`, {
        expiresIn: "1d",
      });

      // context.res.cookie("x-token", token, {
      //   maxAge: 60 * 60 * 24 * 30,
      //   httpOnly: true
      // });

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
            connect: { id: 1 },
            // connect: { id: context.userId }
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
