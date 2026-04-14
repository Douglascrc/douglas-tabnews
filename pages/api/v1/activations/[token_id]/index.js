import controller from "infra/controller.js";
import activation from "models/activation.js";
import { createRouter } from "next-connect";

const router = createRouter();

router.patch(patchHandler);

export default router.handler(controller.errorHandlers);

async function patchHandler(request, response) {
  const tokenId = request.query.token_id;

  const validActivationToken = await activation.findOneValidById(tokenId);
  const tokenUsed = await activation.markTokenAsUsed(validActivationToken.id);

  await activation.activateUserById(validActivationToken.user_id);

  return response.status(200).json(tokenUsed);
}
