import { a as authCondition } from "../../../../../../chunks/auth.js";
import { c as collections } from "../../../../../../chunks/database.js";
import { e as error } from "../../../../../../chunks/index.js";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { d as downloadFile } from "../../../../../../chunks/downloadFile.js";
const GET = async ({ locals, params }) => {
  const sha256 = z.string().parse(params.sha256);
  const userId = locals.user?._id ?? locals.sessionId;
  if (!userId) {
    throw error(401, "Unauthorized");
  }
  if (params.id.length !== 7) {
    const convId = new ObjectId(z.string().parse(params.id));
    const conv = await collections.conversations.findOne({
      _id: convId,
      ...authCondition(locals)
    });
    if (!conv) {
      throw error(404, "Conversation not found");
    }
  } else {
    const conv = await collections.sharedConversations.findOne({
      _id: params.id
    });
    if (!conv) {
      throw error(404, "Conversation not found");
    }
  }
  const { content, mime } = await downloadFile(sha256, params.id);
  return new Response(content, {
    headers: {
      "Content-Type": mime ?? "application/octet-stream"
    }
  });
};
export {
  GET
};
