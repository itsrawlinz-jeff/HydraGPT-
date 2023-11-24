import { d as MONGODB_URL, e as MONGODB_DIRECT_CONNECTION, f as MONGODB_DB_NAME } from "./private.js";
import { MongoClient, GridFSBucket } from "mongodb";
const client = new MongoClient(MONGODB_URL, {
  directConnection: MONGODB_DIRECT_CONNECTION === "true"
});
client.connect().catch(console.error);
const db = client.db(MONGODB_DB_NAME + "");
const conversations = db.collection("conversations");
const sharedConversations = db.collection("sharedConversations");
const abortedGenerations = db.collection("abortedGenerations");
const settings = db.collection("settings");
const users = db.collection("users");
const webSearches = db.collection("webSearches");
const messageEvents = db.collection("messageEvents");
const bucket = new GridFSBucket(db, { bucketName: "files" });
const collections = {
  conversations,
  sharedConversations,
  abortedGenerations,
  settings,
  users,
  webSearches,
  messageEvents,
  bucket
};
client.on("open", () => {
  conversations.createIndex(
    { sessionId: 1, updatedAt: -1 },
    { partialFilterExpression: { sessionId: { $exists: true } } }
  ).catch(console.error);
  conversations.createIndex(
    { userId: 1, updatedAt: -1 },
    { partialFilterExpression: { userId: { $exists: true } } }
  ).catch(console.error);
  webSearches.createIndex({ sessionId: 1, updatedAt: -1 }).catch(console.error);
  abortedGenerations.createIndex({ updatedAt: 1 }, { expireAfterSeconds: 30 }).catch(console.error);
  abortedGenerations.createIndex({ conversationId: 1 }, { unique: true }).catch(console.error);
  sharedConversations.createIndex({ hash: 1 }, { unique: true }).catch(console.error);
  settings.createIndex({ sessionId: 1 }, { unique: true, sparse: true }).catch(console.error);
  settings.createIndex({ userId: 1 }, { unique: true, sparse: true }).catch(console.error);
  users.createIndex({ hfUserId: 1 }, { unique: true }).catch(console.error);
  users.createIndex({ sessionId: 1 }, { unique: true, sparse: true }).catch(console.error);
  messageEvents.createIndex({ createdAt: 1 }, { expireAfterSeconds: 60 }).catch(console.error);
});
export {
  collections as c
};
