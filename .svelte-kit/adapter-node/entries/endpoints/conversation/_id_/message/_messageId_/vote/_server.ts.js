import { a as authCondition } from "../../../../../../../chunks/auth.js";
import { c as collections } from "../../../../../../../chunks/database.js";
import { e as error } from "../../../../../../../chunks/index.js";
import { ObjectId } from "mongodb";
import { z } from "zod";
async function POST({ params, request, locals }) {
  const { score } = z.object({
    score: z.number().int().min(-1).max(1)
  }).parse(await request.json());
  const conversationId = new ObjectId(params.id);
  const messageId = params.messageId;
  const document = await collections.conversations.updateOne(
    {
      _id: conversationId,
      ...authCondition(locals),
      "messages.id": messageId
    },
    {
      ...score !== 0 ? {
        $set: {
          "messages.$.score": score
        }
      } : { $unset: { "messages.$.score": "" } }
    }
  );
  if (!document.matchedCount) {
    throw error(404, "Message not found");
  }
  return new Response();
}
export {
  POST
};
