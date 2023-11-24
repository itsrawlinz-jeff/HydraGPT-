import { a as authCondition } from "../../../../../chunks/auth.js";
import { c as collections } from "../../../../../chunks/database.js";
import { e as error } from "../../../../../chunks/index.js";
import { ObjectId } from "mongodb";
async function POST({ params, locals }) {
  const conversationId = new ObjectId(params.id);
  const conversation = await collections.conversations.findOne({
    _id: conversationId,
    ...authCondition(locals)
  });
  if (!conversation) {
    throw error(404, "Conversation not found");
  }
  await collections.abortedGenerations.updateOne(
    { conversationId },
    { $set: { updatedAt: /* @__PURE__ */ new Date() }, $setOnInsert: { createdAt: /* @__PURE__ */ new Date() } },
    { upsert: true }
  );
  return new Response();
}
export {
  POST
};
