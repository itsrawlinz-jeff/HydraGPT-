import { d as dev } from "../../../chunks/environment.js";
import { b as base } from "../../../chunks/paths.js";
import { C as COOKIE_NAME } from "../../../chunks/private.js";
import { r as redirect } from "../../../chunks/index.js";
const actions = {
  default: async function({ cookies }) {
    cookies.delete(COOKIE_NAME, {
      path: "/",
      // So that it works inside the space's iframe
      sameSite: "none",
      secure: !dev,
      httpOnly: true
    });
    throw redirect(303, `${base}/`);
  }
};
export {
  actions
};
