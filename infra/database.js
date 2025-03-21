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
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "production" ? true : false,
  });

  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
