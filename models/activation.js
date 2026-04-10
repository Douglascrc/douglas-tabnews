import database from "infra/database.js";
import email from "infra/email.js";
import webserver from "infra/webserver.js";

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
  sendEmailToUser,
  create,
};

export default activation;
