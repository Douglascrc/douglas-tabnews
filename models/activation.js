import database from "infra/database.js";
import email from "infra/email.js";
import { NotFoundError } from "infra/errors";
import webserver from "infra/webserver.js";
import user from "./user.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000;

async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newToken = await runInsertQuery(userId, expiresAt);
  return newToken;

  async function runInsertQuery(userId, expiresAt) {
    const results = await database.query({
      text: `
      INSERT INTO
       user_activation_tokens (user_id, expires_at)
      VALUES 
        ($1, $2)
      RETURNING
        *
      ;`,
      values: [userId, expiresAt],
    });

    return results.rows[0];
  }
}

async function findOneValidById(tokenId) {
  const newToken = await runSelectQuery(tokenId);
  return newToken;

  async function runSelectQuery(tokenId) {
    const result = await database.query({
      text: `
      SELECT
       *
      FROM
       user_activation_tokens
      WHERE 
        id = $1
        AND expires_at > NOW()
        AND used_at IS NULL
      LIMIT 
       1;`,
      values: [tokenId],
    });
    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "Token não encontrado no sistema ou expirou.",
        action: "Faça o cadastro novamente",
      });
    }

    return result.rows[0];
  }
}

async function markTokenAsUsed(tokenId) {
  const newToken = await runUpdateQuery(tokenId);
  return newToken;

  async function runUpdateQuery(tokenId) {
    const result = await database.query({
      text: `
      UPDATE
       user_activation_tokens
      SET
        used_at = timezone('utc', now()),
        updated_at = timezone('utc', now())
      WHERE 
        id = $1
        AND expires_at > NOW()
        AND used_at IS NULL
      RETURNING
        *;
      `,
      values: [tokenId],
    });

    return result.rows[0];
  }
}

async function activateUserById(userId) {
  const activatedUser = await user.setFeatures(userId, [
    "create:session",
    "read:session",
    "read:activation_token"
  ]);
  return activatedUser;
}

async function sendEmailToUser(user, activationToken) {
  await email.send({
    from: "Douglas <douglascamdev@hotmail.com>",
    to: user.email,
    subject: "Ative o seu cadastro!",
    text: `${user.username}, clique no link abaixo para ativar o seu cadastro:
    
${webserver.origin}/cadastro/ativar/${activationToken.id}
    
Atenciosamente,
Douglas Campos`,
  });
}

const activation = {
  create,
  sendEmailToUser,
  findOneValidById,
  markTokenAsUsed,
  activateUserById,
};

export default activation;
