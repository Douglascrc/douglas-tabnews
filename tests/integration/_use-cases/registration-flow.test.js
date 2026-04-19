import webserver from "infra/webserver.js";
import user from "models/user";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case Registration Flow (all successful)", () => {
  let createUserResponseBody;
  let activationTokenObject;
  let createSessionResponseBody;

  test("Create user account", async () => {
    const createUserResponse = await fetch(
      `${process.env.WEB_SERVER}/api/v1/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "RegistrationFlow",
          email: "registration.flow@curso.dev",
          password: "RegistrationFlowPassword",
        }),
      },
    );

    expect(createUserResponse.status).toBe(201);

    createUserResponseBody = await createUserResponse.json();

    expect(createUserResponseBody).toEqual({
      id: createUserResponseBody.id,
      username: "RegistrationFlow",
      email: "registration.flow@curso.dev",
      password: createUserResponseBody.password,
      features: ["read:activation_token"],
      created_at: createUserResponseBody.created_at,
      updated_at: createUserResponseBody.updated_at,
    });
  });

  test("Receive a activation email", async () => {
    const lastEmail = await orchestrator.getLastEmail();

    activationTokenObject = await orchestrator.extractUUID();

    expect(lastEmail.sender).toBe("<douglascamdev@hotmail.com>");
    expect(lastEmail.recipients[0]).toBe("<registration.flow@curso.dev>");
    expect(lastEmail.subject).toBe("Ative o seu cadastro!");
    expect(lastEmail.text).toContain("RegistrationFlow");
    expect(activationTokenObject.user_id).toEqual(createUserResponseBody.id);
    expect(activationTokenObject.used_at).toBe(null);
  });

  test("Activate account", async () => {
    const activationResponse = await fetch(
      `${webserver.origin}/api/v1/activations/${activationTokenObject.id}`,
      {
        method: "PATCH",
      },
    );

    expect(activationResponse.status).toBe(200);

    const activationResponseBody = await activationResponse.json();
    expect(Date.parse(activationResponseBody.used_at)).not.toBeNaN();

    const activatedUser = await user.findOneByUsername("RegistrationFlow");
    expect(activatedUser.features).toEqual(["create:session", "read:session"]);
  });

  test("Login", async () => {
    const createSessionResponse = await fetch(
      `${webserver.origin}/api/v1/sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "registration.flow@curso.dev",
          password: "RegistrationFlowPassword",
        }),
      },
    );

    expect(createSessionResponse.status).toBe(201);
    createSessionResponseBody = await createSessionResponse.json();

    expect(createSessionResponseBody.user_id).toBe(createUserResponseBody.id);
  });

  test("Get user information", async () => {
    const userResponse = await fetch(`${webserver.origin}/api/v1/user`, {
      headers: {
        cookie: `session_id=${createSessionResponseBody.token}`,
      },
    });

    expect(userResponse.status).toBe(200);

    const userResponseBody = await userResponse.json();

    expect(userResponseBody.id).toBe(createUserResponseBody.id);
  });
});
