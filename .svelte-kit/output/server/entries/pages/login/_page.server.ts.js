import { r as redirect } from "../../../chunks/index.js";
import { g as getOIDCAuthorizationUrl } from "../../../chunks/auth.js";
import { b as base } from "../../../chunks/paths.js";
const actions = {
  default: async function({ url, locals, request }) {
    const referer = request.headers.get("referer");
    const authorizationUrl = await getOIDCAuthorizationUrl(
      { redirectURI: `${(referer ? new URL(referer) : url).origin}${base}/login/callback` },
      { sessionId: locals.sessionId }
    );
    throw redirect(303, authorizationUrl);
  }
};
export {
  actions
};
