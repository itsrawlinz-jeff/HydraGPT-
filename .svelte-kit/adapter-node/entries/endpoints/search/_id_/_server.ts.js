import { c as collections } from "../../../../chunks/database.js";
import { h as hashConv } from "../../../../chunks/hashConv.js";
import { e as error } from "../../../../chunks/index.js";
import { ObjectId } from "mongodb";
async function GET({ params, locals }) {
  const searchId = new ObjectId(params.id);
  const search = await collections.webSearches.findOne({
    _id: searchId
  });
  if (!search) {
    throw error(404, "Search query not found");
  }
  const conv = await collections.conversations.findOne({
    _id: search.convId
  });
  if (!conv) {
    throw error(404, "Conversation not found");
  }
  const hash = await hashConv(conv);
  const sharedConv = await collections.sharedConversations.findOne({
    hash
  });
  const userShouldSeeConv = conv.userId && locals.user?._id.toString() === conv.userId.toString() || sharedConv !== null;
  if (!userShouldSeeConv) {
    throw error(403, "You don't have access to the conversation here.");
  }
  return new Response(JSON.stringify(search), { headers: { "Content-Type": "application/json" } });
}
export {
  GET
};
