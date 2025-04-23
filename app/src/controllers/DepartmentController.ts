import { PrismaClient } from "@prisma/client";
import { password } from "bun";

const prisma = new PrismaClient();

export const DepartmentController = {
  list: async () => {
    return await prisma.department.findMany({
      include: {
        users: true,
      },
    });
  },
  usersInDepartment: async ({ params }: { params: { id: string } }) => {
    const { id } = params;
    return await prisma.department.findMany({
      where: {
        id: parseInt(id),
      },
      include: {
        users: {
          select: {
            id: true,
            level: true,
            email: true,
            credit: true,
          },
          where: {
            level: "user",
          },
          orderBy: {
            id: "desc",
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
  },
  createDepartmentAndUser: async ({
    body,
  }: {
    body: {
      department: { name: string };
      users: { email: string; password: string }[];
    };
  }) => {
    try {
      const department = await prisma.department.create({
        data: { name: body.department.name },
      });
      await prisma.user.createMany({
        data: body.users.map((user) => ({
          email: user.email,
          password: user.password,
          departmentId: department.id,
        })),
      });
      return { message: "Department and users created successfully" };
    } catch (error) {
      return error;
    }
  },
  countUsersInDepartment: async () => {
    try {
      return await prisma.department.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              users: true,
            },
          },
        },
      });
    } catch (error) {
      return error;
    }
  },
};
