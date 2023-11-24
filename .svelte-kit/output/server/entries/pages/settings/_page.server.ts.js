import { b as base } from "../../../chunks/paths.js";
import { c as collections } from "../../../chunks/database.js";
import { r as redirect } from "../../../chunks/index.js";
import { z } from "zod";
import { v as validateModel, m as models } from "../../../chunks/models.js";
import { a as authCondition } from "../../../chunks/auth.js";
import { D as DEFAULT_SETTINGS } from "../../../chunks/Settings.js";
const booleanFormObject = z.union([z.literal("true"), z.literal("on"), z.literal("false"), z.null()]).transform((value) => {
  return value === "true" || value === "on";
});
const actions = {
  default: async function({ request, locals }) {
    const formData = await request.formData();
    const { ethicsModalAccepted, ...settings } = z.object({
      shareConversationsWithModelAuthors: booleanFormObject,
      hideEmojiOnSidebar: booleanFormObject,
      ethicsModalAccepted: z.boolean({ coerce: true }).optional(),
      activeModel: validateModel(models),
      customPrompts: z.record(z.string()).default({})
    }).parse({
      hideEmojiOnSidebar: formData.get("hideEmojiOnSidebar"),
      shareConversationsWithModelAuthors: formData.get("shareConversationsWithModelAuthors"),
      ethicsModalAccepted: formData.get("ethicsModalAccepted"),
      activeModel: formData.get("activeModel") ?? DEFAULT_SETTINGS.activeModel,
      customPrompts: JSON.parse(formData.get("customPrompts")?.toString() ?? "{}")
    });
    await collections.settings.updateOne(
      authCondition(locals),
      {
        $set: {
          ...settings,
          ...ethicsModalAccepted && { ethicsModalAcceptedAt: /* @__PURE__ */ new Date() },
          updatedAt: /* @__PURE__ */ new Date()
        },
        $setOnInsert: {
          createdAt: /* @__PURE__ */ new Date()
        }
      },
      {
        upsert: true
      }
    );
    throw redirect(303, request.headers.get("referer") || `${base}/`);
  }
};
export {
  actions
};
