import crypto from "node:crypto";
import database from "infra/database.js";
import { UnauthorizedError } from "infra/errors";

const EXPIRATION_IN_MILISECONDS = 60 * 60 * 24 * 30 * 1000;

async function findOneValidByToken(sessionToken) {
  const sessionFound = await runSelectQuery(sessionToken);

  return sessionFound;
  async function runSelectQuery(sessionToken) {
    const result = await database.query({
      text: `
        SELECT  
          * 
        FROM 
          sessions
        WHERE 
          token = $1
          AND expires_at > NOW()
        LIMIT 
          1;`,
      values: [sessionToken],
    });

    if (result.rowCount === 0) {
      throw new UnauthorizedError({
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
      });
    }

    return result.rows[0];
  }
}

async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILISECONDS);

  const newSession = await runInsertQuery(token, userId, expiresAt);
  return newSession;

  async function runInsertQuery(token, userId, expiresAt) {
    const results = await database.query({
      text: `
      INSERT INTO 
        sessions (token, user_id, expires_at)
      VALUES
        ($1, $2, $3)
      RETURNING
        *
      ;`,
      values: [token, userId, expiresAt],
    });
    return results.rows[0];
  }
}

async function renew(sessionId) {
  const expires_at = new Date(Date.now() + EXPIRATION_IN_MILISECONDS);
  const newSession = await runUpdatedQuery(sessionId, expires_at);
  return newSession;

  async function runUpdatedQuery(sessionId, expires_at) {
    const result = await database.query({
      text: `
        UPDATE
          sessions
        SET
          expires_at = $2,
          updated_at = NOW()
        WHERE
          id = $1
        RETURNING
        *
        ;`,
      values: [sessionId, expires_at],
    });

    return result.rows[0];
  }
}

async function expireById(sessionId) {
  const expiredSession = await runUpdatedQuery(sessionId);
  return expiredSession;

  async function runUpdatedQuery(sessionId) {
    const result = await database.query({
      text: `
        UPDATE
          sessions
        SET
          expires_at = expires_at - interval '1 year',
          updated_at = NOW()
        WHERE
         id = $1
        RETURNING
          *
      ;`,
      values: [sessionId],
    });
    return result.rows[0];
  }
}

const session = {
  create,
  findOneValidByToken,
  renew,
  expireById,
  EXPIRATION_IN_MILISECONDS,
};

export default session;
