import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitAllServices();
});

describe("GET /api/v1/status", () => {
  test("Retrieving current database status", async () => {
    const response = await fetch(`${process.env.WEB_SERVER}/api/v1/status`);
    expect(response.status).toBe(200);

    const responseBody = await response.json();
    const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

    expect(responseBody.updated_at).toBeDefined();
    expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

    expect(
      responseBody.dependencies.database_info.max_connections,
    ).toBeDefined();
    expect(typeof responseBody.dependencies.database_info.max_connections).toBe(
      "number",
    );

    expect(
      responseBody.dependencies.database_info.opened_connections,
    ).toBeDefined();
    expect(
      typeof responseBody.dependencies.database_info.opened_connections,
    ).toBe("number");

    expect(responseBody.dependencies.database_info.version).toBeDefined();
    expect(typeof responseBody.dependencies.database_info.version).toBe(
      "string",
    );
  });
});
