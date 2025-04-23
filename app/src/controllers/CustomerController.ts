export default {
  list: () => {
    const customers = [
      { id: 1, name: "John Doe", age: 30, email: "john@doe.com" },
      { id: 2, name: "Jane Doe", age: 25, email: "jane@doe.com" },
      { id: 3, name: "Jack Doe", age: 35, email: "jack@doe.com" },
      { id: 4, name: "Jill Doe", age: 28, email: "jill@doe.com" },
      { id: 5, name: "Joe Doe", age: 40, email: "joe@doe.com" },
    ];
    return customers;
  },
  create: ({
    body,
  }: {
    body: { _id: number; name: string; age: number; email: string };
  }) => {
    return body;
  },
  update: ({
    params,
    body,
  }: {
    params: { id: number };
    body: { name: string; age: number; email: string };
  }) => {
    const { id } = params;
    return { id, ...body };
  },
  remove: ({ params }: { params: { id: number } }) => {
    const { id } = params;
    return { id };
  },
};
