import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Running pending migrations", () => {
    test("For the first time", async () => {
      const response = await fetch(
        `${process.env.WEB_SERVER}/api/v1/migrations`,
        {
          method: "POST",
        },
      );

      expect(response.status).toBe(201);
      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });

    test("For the second time", async () => {
      const response = await fetch(
        `${process.env.WEB_SERVER}/api/v1/migrations`,
        {
          method: "POST",
        },
      );
      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBe(0);
    });
  });
});
