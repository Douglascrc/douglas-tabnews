import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import password from "models/password";

beforeAll(async () => {
  await orchestrator.waitAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await fetch(`${process.env.WEB_SERVER}/api/v1/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "douglasCampos",
      email: "douglas@mail.com",
      password: "1234",
    }),
  });
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With nonexistent 'username'", async () => {
      const response = await fetch(
        `${process.env.WEB_SERVER}/api/v1/users/usuarioInexistente`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "douglasCampos",
          }),
        },
      );

      expect(response.status).toBe(404);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });

    test("With duplicated email", async () => {
      const response = await fetch(`${process.env.WEB_SERVER}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "douglasCampos2",
          email: "douglas@gmail.com",
          password: "123456",
        }),
      });

      expect(response.status).toBe(201);

      const response2 = await fetch(
        `${process.env.WEB_SERVER}/api/v1/users/douglasCampos2`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "douglas@gmail.com",
          }),
        },
      );

      expect(response2.status).toBe(400);
      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado!",
        action: "Verifique o email digitado!",
        status_code: 400,
      });
    });

    test("With a duplicated username", async () => {
      const response = await fetch(`${process.env.WEB_SERVER}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "douglasCampos3",
          email: "doug2@mail.com",
          password: "1234",
        }),
      });
      expect(response.status).toBe(201);

      const response2 = await fetch(`${process.env.WEB_SERVER}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "douglasCampos4",
          email: "douglas3@mail.com",
          password: "1234",
        }),
      });
      expect(response2.status).toBe(201);

      const response3 = await fetch(
        `${process.env.WEB_SERVER}/api/v1/users/douglasCampos`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "douglasCampos2",
          }),
        },
      );

      expect(response3.status).toBe(400);
      const responseBody = await response3.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado!",
        action: "Verifique o username digitado!",
        status_code: 400,
      });
    });

    test("With a unique 'email'", async () => {
      const response = await fetch(
        `${process.env.WEB_SERVER}/api/v1/users/douglasCampos`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "douglasCampos@mail.com",
          }),
        },
      );

      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "douglasCampos",
        email: "douglasCampos@mail.com",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
    });
  });
});
