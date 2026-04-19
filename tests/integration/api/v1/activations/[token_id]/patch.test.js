import { version as uuidVersion } from "uuid";
import activation from "models/activation.js";
import user from "models/user.js";
import orchestrator from "tests/orchestrator.js";
import webserver from "infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH api/v1/activations/[token_id]", () => {
  describe("Anonymous user", () => {
    test("With nonexistent token", async () => {
      const response = await fetch(
        `${webserver.origin}/api/v1/activations/c9a6c8d1-f6d9-4cde-8114-2bf84799d103`,
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Token não encontrado no sistema ou expirou.",
        action: "Faça o cadastro novamente.",
        status_code: 404,
      });
    });

    test("With expired token", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - activation.EXPIRATION_IN_MILLISECONDS),
      });

      const createdUser = await orchestrator.createUser();
      const activationToken = await activation.create(createdUser.id);

      jest.useRealTimers();
      const response = await fetch(
        `${webserver.origin}/api/v1/activations/${activationToken.id}`,
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        action: "Faça o cadastro novamente.",
        message: "Token não encontrado no sistema ou expirou.",
        status_code: 404,
      });
    });

    test("With already used token", async () => {
      const createdUser = await orchestrator.createUser();
      const activationToken = await activation.create(createdUser.id);

      const response1 = await fetch(
        `${webserver.origin}/api/v1/activations/${activationToken.id}`,
        {
          method: "PATCH",
        },
      );

      expect(response1.status).toBe(200);

      const response2 = await fetch(
        `${webserver.origin}/api/v1/activations/${activationToken.id}`,
        {
          method: "PATCH",
        },
      );

      expect(response2.status).toBe(404);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: "NotFoundError",
        message: "Token não encontrado no sistema ou expirou.",
        action: "Faça o cadastro novamente.",
        status_code: 404,
      });
    });

    test("With valid token but already activated user", async () => {
      const createdUser = await orchestrator.createUser();
      const activationToken = await activation.create(createdUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/activations/${activationToken.id}`,
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(200);

      const response2 = await fetch(
        `${webserver.origin}/api/v1/activations/${activationToken.id}`,
        {
          method: "PATCH",
        },
      );

      expect(response2.status).toBe(404);

      const responseBody = await response2.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        action: "Faça o cadastro novamente.",
        message: "Token não encontrado no sistema ou expirou.",
        status_code: 404,
      });
    });

    test("With valid token", async () => {
      const createdUser = await orchestrator.createUser();
      const activationToken = await activation.create(createdUser.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/activations/${activationToken.id}`,
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: activationToken.id,
        user_id: activationToken.user_id,
        used_at: responseBody.used_at,
        expires_at: activationToken.expires_at.toISOString(),
        created_at: activationToken.created_at.toISOString(),
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(uuidVersion(responseBody.user_id)).toBe(4);

      expect(new Date(responseBody.expires_at)).not.toBeNaN();
      expect(new Date(responseBody.created_at)).not.toBeNaN();
      expect(new Date(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.expires_at > responseBody.created_at).toBe(true);

      const expiresAt = new Date(responseBody.expires_at);
      const createdAt = new Date(responseBody.created_at);

      expiresAt.setMilliseconds(0);
      createdAt.setMilliseconds(0);

      expect(expiresAt - createdAt).toEqual(
        activation.EXPIRATION_IN_MILLISECONDS,
      );

      const activatedUser = await user.findOneById(createdUser.id);
      expect(activatedUser.features).toEqual([
        "create:session",
        "read:session",
      ]);
    });
  });

  describe("Default user", () => {
    test("With valid token but already logged in user", async () => {
      const createdUser1 = await orchestrator.createUser();
      const createdUser2 = await orchestrator.createUser();

      const sessionObjectUser1 = await orchestrator.createSession(
        createdUser1.id,
      );
      await orchestrator.activationUser(createdUser1);
      const activationTokenUser2 = await activation.create(createdUser2.id);

      const response = await fetch(
        `${webserver.origin}/api/v1/activations/${activationTokenUser2.id}`,
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${sessionObjectUser1.token}`,
          },
        },
      );

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "Você não possui permissão para executar esta ação.",
        action:
          "Verifique se o seu usuário possui a feature read:activation_token.",
        status_code: 403,
      });
    });
  });
});
