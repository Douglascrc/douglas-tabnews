import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitAllServices();
  await orchestrator.clearDatabase();
});

describe("GET /api/v1/migrations ", () => {
  test("Retrieving migrations", async () => {
    const response = await fetch(`${process.env.WEB_SERVER}/api/v1/migrations`);
    expect(response.status).toBe(200);

    const responseBody = await response.json();
    console.log(responseBody);

    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);
  });
});
