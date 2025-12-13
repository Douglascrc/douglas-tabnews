import session from "models/session";
import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/user", () => {
  describe("Default user", () => {
    test("With valid session", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UserWithValidSession",
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

      const response = await fetch(`${process.env.WEB_SERVER}/api/v1/user`, {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: createdUser.id,
        username: "UserWithValidSession",
        email: createdUser.email,
        password: createdUser.password,
        created_at: createdUser.created_at.toISOString(),
        updated_at: createdUser.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With expired session", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - session.EXPIRATION_IN_MILISECONDS),
      });

      const createdUser = await orchestrator.createUser({
        username: "UserWithExpiratedSession",
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

      const response = await fetch(`${process.env.WEB_SERVER}/api/v1/user`, {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      jest.useRealTimers();

      expect(response.status).toBe(401);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
        status_code: 401,
      });
    });

    test("With nonexistent session", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UserWithNonExistSession",
      });

      let sessionObject = await orchestrator.createSession(createdUser.id);

      sessionObject.token = "a0345416395633f80483f967bdbe580ea440b925c2f46f29c14a704376f7c871a38447c14a80fb618b3896eda753cc6f";

      const response = await fetch(`${process.env.WEB_SERVER}/api/v1/user`, {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(401);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
        status_code: 401,
      });
    });
  });
});
