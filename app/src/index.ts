import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";

import CustomerController from "./controllers/CustomerController";
import { UserController } from "./controllers/UserController";
import { DepartmentController } from "./controllers/DepartmentController";

const app = new Elysia()
  .use(cors())
  .use(staticPlugin())
  .use(
    swagger({
      documentation: {
        tags: [
          { name: "User", description: "User related endpoints" },
          { name: "Customer", description: "Customer related endpoints" },
          { name: "Department", description: "Department related endpoints" },
        ],
      },
    })
  )
  .use(
    jwt({
      name: "jwt",
      secret: "secret",
    })
  )
  .group("/users", { tags: ["User"] }, (app) =>
    app
      .get("/", UserController.list)
      .post("/", UserController.create)
      .put("/:id", UserController.update)
      .delete("/:id", UserController.remove)
      .get("/some-fields", UserController.findSomeFields)
      .get("/sort", UserController.sort)
      .get("/filter", UserController.filter)
      .get("/grate-than", UserController.grateThan)
      .get("/less-than", UserController.lessThan)
      .get("/not-equal", UserController.notEqual)
      .get("/in", UserController.in)
      .get("/isnull", UserController.isNull)
      .get("/isnotnull", UserController.isNotNull)
      .get("/between", UserController.between)
      .get("/count", UserController.count)
      .get("/sum", UserController.sum)
      .get("/max", UserController.max)
      .get("/min", UserController.min)
      .get("/avg", UserController.avg)
      .get("/users-dept", UserController.usersAndDepartment, {
        tags: ["User"],
      })
      .post("/sign-in", UserController.signIn)
  )
  .group("/departments", { tags: ["Department"] }, (app) =>
    app
      .get("/", DepartmentController.list)
      .get("user-in-dept/:id", DepartmentController.usersInDepartment)
      .post("create-dept-user", DepartmentController.createDepartmentAndUser)
      .get("count-user-dept", DepartmentController.countUsersInDepartment)
  )
  .group("/customers", { tags: ["Customer"] }, (app) =>
    app
      .get("/", CustomerController.list)
      .post("/", CustomerController.create)
      .put("/:id", CustomerController.update)
      .delete("/:id", CustomerController.remove)
  )
  .post("/login", async ({ jwt, cookie: { auth } }) => {
    const user = {
      id: 1,
      name: "John Doe",
      username: "john",
      level: "admin",
    };

    const token = await jwt.sign(user);

    auth.set({
      value: token,
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      path: "/profile",
    });

    return {
      message: "Login successful",
      token,
    };
  })
  .get("/profile", async ({ jwt, cookie: { auth } }) => {
    const profile = await jwt.verify(auth.value);
    return profile;
  })
  .get("/logout", async ({ cookie: { auth } }) => {
    auth.remove();
    return {
      message: "Logout successful",
    };
  })
  .get("info", async ({ jwt, request }) => {
    if (request.headers.get("Authorization") === null) {
      return {
        message: "Authorization header not found",
      };
    }

    const token = request.headers.get("Authorization") ?? "";

    if (token === "") {
      return {
        message: "token is empty",
      };
    }

    const payload = await jwt.verify(token);

    return {
      message: "Token is valid",
      payload,
    };
  })
  .get("/", () => "Hello Elysia")
  .get("/hello", () => "Hello World")

  // get with params
  .get("/hello/:name", ({ params }) => `Hello ${params.name}`)

  // get and multiple params
  .get("/hello/:name/:age", ({ params }) => {
    const { name, age } = params;

    return `Hello ${name}, you are ${age} years old`;
  })

  .get("/customers", () => {
    const customers = [
      { id: 1, name: "John Doe", age: 30 },
      { id: 2, name: "Jane Doe", age: 25 },
      { id: 3, name: "Jack Doe", age: 35 },
      { id: 4, name: "Jill Doe", age: 28 },
      { id: 5, name: "Joe Doe", age: 40 },
    ];
    return customers;
  })

  .get("/customers/:id", ({ params }) => {
    const customers = [
      { id: 1, name: "John Doe", age: 30 },
      { id: 2, name: "Jane Doe", age: 25 },
      { id: 3, name: "Jack Doe", age: 35 },
      { id: 4, name: "Jill Doe", age: 28 },
      { id: 5, name: "Joe Doe", age: 40 },
    ];

    const customer = customers.find(
      (customer) => customer.id === parseInt(params.id)
    );

    if (!customer) {
      return { message: "Customer not found" };
    }
    return customer;
  })

  // get with query params
  // http://localhost:3000/customer/query?name=karn&age=19
  .get("/customer/query", ({ query }) => {
    const { name, age } = query;
    return `Hello ${name}, you are ${age} years old`;
  })

  //get with status code
  .get("/customer/status", () => {
    return new Response("Hello Elysia", {
      status: 500,
    });
  })

  .post(
    "/customer/create",
    ({ body }: { body: { name: string; age: number } }) => {
      console.log(body);
      const { name, age } = body;
      return `Hello ${name}, you are ${age} years old`;
    }
  )

  //put
  .put(
    "/customer/update/:customerId",
    ({
      params,
      body,
    }: {
      params: { customerId: string };
      body: { name: string; age: number };
    }) => {
      console.log(body);
      const { customerId } = params;
      const { name, age } = body;
      return `customerId : ${customerId}, Hello ${name}, you are ${age} years old`;
    }
  )

  //delete
  .delete(
    "/customer/delete/:customerId",
    ({ params }: { params: { customerId: string } }) => {
      const { customerId } = params;
      return `customerId : ${customerId} deleted`;
    }
  )

  // upload file
  .post("/upload-file", ({ body }: { body: { file: File } }) => {
    const { file } = body;
    console.log(file);

    Bun.write("uploads/" + file.name, file);

    return `File ${file.name} uploaded`;
  })

  // write file
  .get("/write-file", () => {
    const data = "Hello Elysia";
    Bun.write("hello.txt", data);
    return "File hello.txt created";
  })

  // read file
  .get("/read-file", () => {
    const data = Bun.file("hello.txt");
    return data.text();
  })
  //listen
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
