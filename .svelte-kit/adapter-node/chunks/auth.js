import { Issuer, custom } from "openid-client";
import { addYears, addHours } from "date-fns";
import { g as OPENID_CONFIG, h as OPENID_CLIENT_ID, i as OPENID_CLIENT_SECRET, j as OPENID_PROVIDER_URL, k as OPENID_SCOPES, l as OPENID_TOLERANCE, m as OPENID_RESOURCE, C as COOKIE_NAME } from "./private.js";
import { s as sha256 } from "./sha256.js";
import { z } from "zod";
import { d as dev } from "./environment.js";
const stringWithDefault = (value) => z.string().default(value).transform((el) => el ? el : value);
const OIDConfig = z.object({
  CLIENT_ID: stringWithDefault(OPENID_CLIENT_ID),
  CLIENT_SECRET: stringWithDefault(OPENID_CLIENT_SECRET),
  PROVIDER_URL: stringWithDefault(OPENID_PROVIDER_URL),
  SCOPES: stringWithDefault(OPENID_SCOPES),
  TOLERANCE: stringWithDefault(OPENID_TOLERANCE),
  RESOURCE: stringWithDefault(OPENID_RESOURCE)
}).parse(JSON.parse(OPENID_CONFIG));
const requiresUser = !!OIDConfig.CLIENT_ID && !!OIDConfig.CLIENT_SECRET;
function refreshSessionCookie(cookies, sessionId) {
  cookies.set(COOKIE_NAME, sessionId, {
    path: "/",
    // So that it works inside the space's iframe
    sameSite: "none",
    secure: !dev,
    httpOnly: true,
    expires: addYears(/* @__PURE__ */ new Date(), 1)
  });
}
const authCondition = (locals) => {
  return locals.user ? { userId: locals.user._id } : { sessionId: locals.sessionId, userId: { $exists: false } };
};
async function generateCsrfToken(sessionId, redirectUrl) {
  const data = {
    expiration: addHours(/* @__PURE__ */ new Date(), 1).getTime(),
    redirectUrl
  };
  return Buffer.from(
    JSON.stringify({
      data,
      signature: await sha256(JSON.stringify(data) + "##" + sessionId)
    })
  ).toString("base64");
}
async function getOIDCClient(settings) {
  const issuer = await Issuer.discover(OIDConfig.PROVIDER_URL);
  return new issuer.Client({
    client_id: OIDConfig.CLIENT_ID,
    client_secret: OIDConfig.CLIENT_SECRET,
    redirect_uris: [settings.redirectURI],
    response_types: ["code"],
    [custom.clock_tolerance]: OIDConfig.TOLERANCE || void 0
  });
}
async function getOIDCAuthorizationUrl(settings, params) {
  const client = await getOIDCClient(settings);
  const csrfToken = await generateCsrfToken(params.sessionId, settings.redirectURI);
  return client.authorizationUrl({
    scope: OIDConfig.SCOPES,
    state: csrfToken,
    resource: OIDConfig.RESOURCE || void 0
  });
}
async function getOIDCUserData(settings, code) {
  const client = await getOIDCClient(settings);
  const token = await client.callback(settings.redirectURI, { code });
  const userData = await client.userinfo(token);
  return { token, userData };
}
async function validateAndParseCsrfToken(token, sessionId) {
  try {
    const { data, signature } = z.object({
      data: z.object({
        expiration: z.number().int(),
        redirectUrl: z.string().url()
      }),
      signature: z.string().length(64)
    }).parse(JSON.parse(token));
    const reconstructSign = await sha256(JSON.stringify(data) + "##" + sessionId);
    if (data.expiration > Date.now() && signature === reconstructSign) {
      return { redirectUrl: data.redirectUrl };
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}
export {
  authCondition as a,
  refreshSessionCookie as b,
  getOIDCUserData as c,
  getOIDCAuthorizationUrl as g,
  requiresUser as r,
  validateAndParseCsrfToken as v
};
