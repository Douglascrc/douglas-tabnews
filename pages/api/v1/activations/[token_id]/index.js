import controller from "infra/controller.js";
import activation from "models/activation.js";
import { createRouter } from "next-connect";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.patch(controller.canRequest("read:activation_token"), patchHandler);

export default router.handler(controller.errorHandlers);

async function patchHandler(request, response) {
  const tokenId = request.query.token_id;

  const validActivationToken = await activation.findOneValidById(tokenId);
  await activation.activateUserById(validActivationToken.user_id);
  const tokenUsed = await activation.markTokenAsUsed(validActivationToken.id);

  return response.status(200).json(tokenUsed);
}
