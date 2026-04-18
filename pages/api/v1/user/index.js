import controller from "infra/controller.js";
import { ForbiddenError } from "infra/errors.js";
import authorization from "models/authorization.js";
import session from "models/session.js";
import user from "models/user";
import { createRouter } from "next-connect";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.get(controller.canRequest("read:session"), getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const sessionToken = request.cookies.session_id;

  const sessionObject = await session.findOneValidByToken(sessionToken);
  const renewSessionObject = await session.renew(sessionObject.id);
  controller.setSessionCookie(renewSessionObject.token, response);

  const userFound = await user.findOneById(renewSessionObject.user_id);

  if (!authorization.can(userFound, "read:session")) {
    throw new ForbiddenError({
      message: "Você não possui permissão para ver a sessão.",
      action: "Contate o suporte caso você acredite que isso seja um erro.",
    });
    
  }
  response.setHeader(
    "Cache-Control",
    "no-cache, no-store, max-age=0, must-revalidate",
  );
  return response.status(200).json(userFound);
}
