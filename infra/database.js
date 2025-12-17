import { Client } from "pg";
import { ServiceError } from "./errors";

async function query(text, params) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    const ServiceErrorObject = new ServiceError({
      cause: error,
      message: "Erro na conexão com o banco de dados ou na Query.",
    });
    throw ServiceErrorObject;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
