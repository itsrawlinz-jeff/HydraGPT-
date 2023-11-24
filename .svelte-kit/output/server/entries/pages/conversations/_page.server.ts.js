import { b as base } from "../../../chunks/paths.js";
import { a as authCondition } from "../../../chunks/auth.js";
import { c as collections } from "../../../chunks/database.js";
import { r as redirect } from "../../../chunks/index.js";
const actions = {
  delete: async function({ locals }) {
    if (locals.user?._id || locals.sessionId) {
      await collections.conversations.deleteMany({
        ...authCondition(locals)
      });
    }
    throw redirect(303, `${base}/`);
  }
};
export {
  actions
};
