import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const UserController = {
  list: async () => {
    return await prisma.user.findMany();
  },
  create: async ({ body }: { body: { email: string; password: string } }) => {
    try {
      await prisma.user.create({ data: body });

      return { message: "User created successfully" };
    } catch (error) {
      return error;
    }
  },
  update: async ({
    params,
    body,
  }: {
    params: { id: string };
    body: { email: string; password: string };
  }) => {
    try {
      const { id } = params;
      await prisma.user.update({ where: { id: parseInt(id) }, data: body });

      return { message: "User updated successfully" };
    } catch (error) {
      return error;
    }
  },
  remove: async ({ params }: { params: { id: string } }) => {
    try {
      const { id } = params;
      await prisma.user.delete({ where: { id: parseInt(id) } });

      return { message: "User deleted successfully" };
    } catch (error) {
      return error;
    }
  },
  findSomeFields: async () => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          credit: true,
          level: true,
        },
      });

      return users;
    } catch (error) {
      return error;
    }
  },
  sort: async () => {
    try {
      const users = await prisma.user.findMany({
        orderBy: {
          credit: "asc",
        },
      });

      return users;
    } catch (error) {
      return error;
    }
  },
  filter: async () => {
    try {
      const users = await prisma.user.findMany({
        where: {
          level: "user",
        },
      });

      return users;
    } catch (error) {
      return error;
    }
  },
  grateThan: async () => {
    try {
      const users = await prisma.user.findMany({
        where: {
          credit: {
            gt: 100,
          },
        },
      });

      return users;
    } catch (error) {
      return error;
    }
  },
  lessThan: async () => {
    try {
      const users = await prisma.user.findMany({
        where: {
          credit: {
            lt: 200,
          },
        },
      });

      return users;
    } catch (error) {
      return error;
    }
  },
  notEqual: async () => {
    try {
      const users = await prisma.user.findMany({
        where: {
          credit: {
            not: 200,
          },
        },
      });

      return users;
    } catch (error) {
      return error;
    }
  },
  in: async () => {
    try {
      const users = await prisma.user.findMany({
        where: {
          credit: { in: [100, 200] },
        },
      });

      return users;
    } catch (error) {
      return error;
    }
  },
  isNull: async () => {
    try {
      const users = await prisma.user.findMany({
        where: {
          credit: {
            equals: null,
          },
        },
      });

      return users;
    } catch (error) {
      return error;
    }
  },
  isNotNull: async () => {
    try {
      const users = await prisma.user.findMany({
        where: {
          credit: {
            not: null,
          },
        },
      });

      return users;
    } catch (error) {
      return error;
    }
  },
  between: async () => {
    try {
      const users = await prisma.user.findMany({
        where: {
          credit: {
            gte: 100,
            lte: 200,
          },
        },
      });

      return users;
    } catch (error) {
      return error;
    }
  },
  count: async () => {
    try {
      const totalRows = await prisma.user.count();
      return { totalRows };
    } catch (error) {
      return error;
    }
  },
  sum: async () => {
    try {
      const totalCredit = await prisma.user.aggregate({
        _sum: {
          credit: true,
        },
      });
      return { totalCredit };
    } catch (error) {
      return error;
    }
  },
  max: async () => {
    try {
      const maxCredit = await prisma.user.aggregate({
        _max: {
          credit: true,
        },
      });
      return { maxCredit };
    } catch (error) {
      return error;
    }
  },
  min: async () => {
    try {
      const minCredit = await prisma.user.aggregate({
        _min: {
          credit: true,
        },
      });
      return { minCredit };
    } catch (error) {
      return error;
    }
  },
  avg: async () => {
    try {
      const avgCredit = await prisma.user.aggregate({
        _avg: {
          credit: true,
        },
      });
      return { avgCredit };
    } catch (error) {
      return error;
    }
  },
  usersAndDepartment: async () => {
    try {
      const users = await prisma.user.findMany({
        include: {
          department: true,
        },
      });
      return users;
    } catch (error) {
      return error;
    }
  },
  signIn: async ({ body }: { body: { email: string; password: string } }) => {
    try {
      const { email, password } = body;

      if (!email || !password) {
        return { message: "Email and password are required" };
      }

      const user = await prisma.user.findFirst({
        where: {
          email,
          password,
        },
      });

      if (!user) {
        return { message: "Invalid credentials" };
      }

      return user;
    } catch (error) {
      return error;
    }
  },
};
