import { Context } from "../context";
import * as bcrypt from "bcrypt";


/*******
 * Queries
 ********/
export const getPoll = async (id: string, context: Context) => {
    const pollId = Number(id);

    if (!Number.isNaN(pollId)) {
      return context.prisma.polls.findUnique({
        where: { id: pollId },
      });
    }

    return context.prisma.polls.findUnique({
      where: { slug: id },
    });
}

/*******
 * Mutations
 ********/
export const login = async (email: string, password: string, context: Context) => {
    const user = await context.prisma.users.findUnique({ where: { email } });

    if (!user) throw new Error(`No user found for email: ${email}`);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error("Invalid password"); 

    return user;
}