import { M as MESSAGES_BEFORE_LOGIN } from "../../../../chunks/private.js";
import { a as authCondition, r as requiresUser } from "../../../../chunks/auth.js";
import { c as collections } from "../../../../chunks/database.js";
import { s as smallModel, m as models } from "../../../../chunks/models.js";
import { e as error } from "../../../../chunks/index.js";
import { ObjectId } from "mongodb";
import { z } from "zod";
import "serpapi";
import { VirtualConsole, JSDOM } from "jsdom";
import { format } from "date-fns";
import { dot, pipeline } from "@xenova/transformers";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { s as sha256 } from "../../../../chunks/sha256.js";
import sizeof from "image-size";
var WebSearchProvider = /* @__PURE__ */ ((WebSearchProvider2) => {
  WebSearchProvider2["GOOGLE"] = "Google";
  WebSearchProvider2["YOU"] = "You.com";
  return WebSearchProvider2;
})(WebSearchProvider || {});
function getWebSearchProvider() {
  return WebSearchProvider.GOOGLE;
}
async function searchWeb(query) {
  throw new Error("No You.com or Serper.dev or SerpAPI key found");
}
async function generateFromDefaultEndpoint({
  messages,
  preprompt
}) {
  const endpoint = await smallModel.getEndpoint();
  const tokenStream = await endpoint({ conversation: { messages, preprompt } });
  for await (const output of tokenStream) {
    if (output.generated_text) {
      let generated_text = output.generated_text;
      for (const stop of [...smallModel.parameters?.stop ?? [], "<|endoftext|>"]) {
        if (generated_text.endsWith(stop)) {
          generated_text = generated_text.slice(0, -stop.length).trimEnd();
        }
      }
      return generated_text;
    }
  }
  throw new Error("Generation failed");
}
async function generateQuery(messages) {
  const currentDate = format(/* @__PURE__ */ new Date(), "MMMM d, yyyy");
  const userMessages = messages.filter(({ from }) => from === "user");
  const previousUserMessages = userMessages.slice(0, -1);
  const lastMessage = userMessages.slice(-1)[0];
  const convQuery = [
    {
      from: "user",
      content: `Previous Questions:
- Who is the president of France?

Current Question: What about Mexico?
`
    },
    {
      from: "assistant",
      content: "President of Mexico"
    },
    {
      from: "user",
      content: `Previous questions: 
- When is the next formula 1 grand prix?

Current Question: Where is it being hosted ?`
    },
    {
      from: "assistant",
      content: "location of next formula 1 grand prix"
    },
    {
      from: "user",
      content: "Current Question: What type of printhead does the Epson F2270 DTG printer use?"
    },
    {
      from: "assistant",
      content: "Epson F2270 DTG printer printhead"
    },
    { from: "user", content: "What were the news yesterday ?" },
    {
      from: "assistant",
      content: `news ${format(new Date(Date.now() - 864e5), "MMMM d, yyyy")}`
    },
    { from: "user", content: "What is the current weather in Paris ?" },
    { from: "assistant", content: `weather in Paris ${currentDate}` },
    {
      from: "user",
      content: (previousUserMessages.length > 0 ? `Previous questions: 
${previousUserMessages.map(({ content }) => `- ${content}`).join("\n")}` : "") + "\n\nCurrent Question:" + lastMessage.content
    }
  ];
  return await generateFromDefaultEndpoint({
    messages: convQuery,
    preprompt: `You are tasked with generating web search queries. Give me an appropriate query to answer my question for google search. Answer with only the query. Today is ${currentDate}`
  });
}
async function parseWeb(url) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), 1e4);
  const htmlString = await fetch(url, { signal: abortController.signal }).then((response) => response.text()).catch();
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("error", () => {
  });
  const dom = new JSDOM(htmlString ?? "", {
    virtualConsole
  });
  const { document } = dom.window;
  const textElTags = "p";
  const paragraphs = document.querySelectorAll(textElTags);
  if (!paragraphs.length) {
    throw new Error(`webpage doesn't have any "${textElTags}" element`);
  }
  const paragraphTexts = Array.from(paragraphs).map((p) => p.textContent);
  const text = paragraphTexts.join(" ").replace(/ {2}|\r\n|\n|\r/gm, "");
  return text;
}
function chunk(arr, chunkSize) {
  if (isNaN(chunkSize) || chunkSize < 1) {
    throw new RangeError("Invalid chunk size: " + chunkSize);
  }
  if (!arr.length) {
    return [];
  }
  if (arr.length <= chunkSize) {
    return [arr];
  }
  return range(Math.ceil(arr.length / chunkSize)).map((i) => {
    return arr.slice(i * chunkSize, (i + 1) * chunkSize);
  });
}
function range(n, b) {
  return b ? Array(b - n).fill(0).map((_, i) => n + i) : Array(n).fill(0).map((_, i) => i);
}
function innerProduct(tensor1, tensor2) {
  return 1 - dot(tensor1.data, tensor2.data);
}
class PipelineSingleton {
  static async getInstance() {
    if (this.instance === null) {
      this.instance = pipeline("feature-extraction", this.modelId);
    }
    return this.instance;
  }
}
PipelineSingleton.modelId = "Xenova/gte-small";
PipelineSingleton.instance = null;
const MAX_SEQ_LEN = 512;
async function findSimilarSentences(query, sentences, { topK = 5 }) {
  const input = [query, ...sentences];
  const extractor = await PipelineSingleton.getInstance();
  const output = await extractor(input, { pooling: "mean", normalize: true });
  const queryTensor = output[0];
  const sentencesTensor = output.slice([1, input.length - 1]);
  const distancesFromQuery = [...sentencesTensor].map(
    (sentenceTensor, index) => {
      return {
        distance: innerProduct(queryTensor, sentenceTensor),
        index
      };
    }
  );
  distancesFromQuery.sort((a, b) => {
    return a.distance - b.distance;
  });
  return distancesFromQuery.slice(0, topK).map((item) => item.index);
}
const MAX_N_PAGES_SCRAPE = 10;
const MAX_N_PAGES_EMBED = 5;
const DOMAIN_BLOCKLIST = ["youtube.com", "twitter.com"];
async function runWebSearch(conv, prompt, updatePad) {
  const messages = (() => {
    return [...conv.messages, { content: prompt, from: "user", id: crypto.randomUUID() }];
  })();
  const webSearch = {
    prompt,
    searchQuery: "",
    results: [],
    context: "",
    contextSources: [],
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  };
  function appendUpdate(message, args, type) {
    updatePad({ type: "webSearch", messageType: type ?? "update", message, args });
  }
  try {
    webSearch.searchQuery = await generateQuery(messages);
    const searchProvider = getWebSearchProvider();
    appendUpdate(`Searching ${searchProvider}`, [webSearch.searchQuery]);
    const results = await searchWeb(webSearch.searchQuery);
    webSearch.results = (results.organic_results && results.organic_results.map((el) => {
      const { title, link, text } = el;
      const { hostname } = new URL(link);
      return { title, link, hostname, text };
    })) ?? [];
    webSearch.results = webSearch.results.filter(({ link }) => !DOMAIN_BLOCKLIST.some((el) => link.includes(el))).slice(0, MAX_N_PAGES_SCRAPE);
    let paragraphChunks = [];
    if (webSearch.results.length > 0) {
      appendUpdate("Browsing results");
      const promises = webSearch.results.map(async (result) => {
        const { link } = result;
        let text = result.text ?? "";
        if (!text) {
          try {
            text = await parseWeb(link);
            appendUpdate("Browsing webpage", [link]);
          } catch (e) {
          }
        }
        const MAX_N_CHUNKS = 100;
        const texts2 = chunk(text, MAX_SEQ_LEN).slice(0, MAX_N_CHUNKS);
        return texts2.map((t) => ({ source: result, text: t }));
      });
      const nestedParagraphChunks = (await Promise.all(promises)).slice(0, MAX_N_PAGES_EMBED);
      paragraphChunks = nestedParagraphChunks.flat();
      if (!paragraphChunks.length) {
        throw new Error("No text found on the first 5 results");
      }
    } else {
      throw new Error("No results found for this search query");
    }
    appendUpdate("Extracting relevant information");
    const topKClosestParagraphs = 8;
    const texts = paragraphChunks.map(({ text }) => text);
    const indices = await findSimilarSentences(prompt, texts, {
      topK: topKClosestParagraphs
    });
    webSearch.context = indices.map((idx) => texts[idx]).join("");
    const usedSources = /* @__PURE__ */ new Set();
    for (const idx of indices) {
      const { source } = paragraphChunks[idx];
      if (!usedSources.has(source.link)) {
        usedSources.add(source.link);
        webSearch.contextSources.push(source);
      }
    }
    updatePad({
      type: "webSearch",
      messageType: "sources",
      message: "sources",
      sources: webSearch.contextSources
    });
  } catch (searchError) {
    if (searchError instanceof Error) {
      appendUpdate(
        "An error occurred with the web search",
        [JSON.stringify(searchError.message)],
        "error"
      );
    }
  }
  return webSearch;
}
let closed = false;
process.on("SIGINT", () => {
  closed = true;
});
let abortedGenerations = /* @__PURE__ */ new Map();
async function maintainAbortedGenerations() {
  while (!closed) {
    await setTimeout$1(1e3);
    try {
      const aborts = await collections.abortedGenerations.find({}).sort({ createdAt: 1 }).toArray();
      abortedGenerations = new Map(
        aborts.map(({ conversationId, createdAt }) => [conversationId.toString(), createdAt])
      );
    } catch (err) {
      console.error(err);
    }
  }
}
maintainAbortedGenerations();
async function summarize(prompt) {
  const messages = [
    { from: "user", content: "Who is the president of Gabon?" },
    { from: "assistant", content: "🇬🇦 President of Gabon" },
    { from: "user", content: "Who is Julien Chaumond?" },
    { from: "assistant", content: "🧑 Julien Chaumond" },
    { from: "user", content: "what is 1 + 1?" },
    { from: "assistant", content: "🔢 Simple math operation" },
    { from: "user", content: "What are the latest news?" },
    { from: "assistant", content: "📰 Latest news" },
    { from: "user", content: "How to make a great cheesecake?" },
    { from: "assistant", content: "🍰 Cheesecake recipe" },
    { from: "user", content: "what is your favorite movie? do a short answer." },
    { from: "assistant", content: "🎥 Favorite movie" },
    { from: "user", content: "Explain the concept of artificial intelligence in one sentence" },
    { from: "assistant", content: "🤖 AI definition" },
    { from: "user", content: prompt }
  ];
  return await generateFromDefaultEndpoint({
    messages,
    preprompt: `You are a summarization AI. You'll never answer a user's question directly, but instead summarize the user's request into a single short sentence of four words or less. Always start your answer with an emoji relevant to the summary.`
  }).then((summary) => {
    if (!/\p{Emoji}/u.test(summary.slice(0, 3))) {
      return "💬 " + summary;
    }
    return summary;
  }).catch((e) => {
    console.error(e);
    return null;
  });
}
async function uploadFile(file, conv) {
  const sha = await sha256(await file.text());
  const upload = collections.bucket.openUploadStream(`${conv._id}-${sha}`, {
    metadata: { conversation: conv._id.toString(), mime: "image/jpeg" }
  });
  upload.write(await file.arrayBuffer());
  upload.end();
  return new Promise((resolve, reject) => {
    upload.once("finish", () => resolve(sha));
    upload.once("error", reject);
    setTimeout(() => reject(new Error("Upload timed out")), 1e4);
  });
}
async function POST({ request, locals, params, getClientAddress }) {
  const id = z.string().parse(params.id);
  const convId = new ObjectId(id);
  const promptedAt = /* @__PURE__ */ new Date();
  const userId = locals.user?._id ?? locals.sessionId;
  if (!userId) {
    throw error(401, "Unauthorized");
  }
  const conv = await collections.conversations.findOne({
    _id: convId,
    ...authCondition(locals)
  });
  if (!conv) {
    throw error(404, "Conversation not found");
  }
  await collections.messageEvents.insertOne({
    userId,
    createdAt: /* @__PURE__ */ new Date(),
    ip: getClientAddress()
  });
  if (!locals.user?._id && requiresUser && 0 > 0) {
    const totalMessages = (await collections.conversations.aggregate([
      { $match: authCondition(locals) },
      { $project: { messages: 1 } },
      { $unwind: "$messages" },
      { $match: { "messages.from": "assistant" } },
      { $count: "messages" }
    ]).toArray())[0]?.messages ?? 0;
    if (totalMessages > parseInt(MESSAGES_BEFORE_LOGIN)) {
      throw error(429, "Exceeded number of messages before login");
    }
  }
  Math.max(
    await collections.messageEvents.countDocuments({ userId }),
    await collections.messageEvents.countDocuments({ ip: getClientAddress() })
  );
  const model = models.find((m) => m.id === conv.model);
  if (!model) {
    throw error(410, "Model not available anymore");
  }
  const json = await request.json();
  const {
    inputs: newPrompt,
    response_id: responseId,
    id: messageId,
    is_retry,
    web_search: webSearch,
    files: b64files
  } = z.object({
    inputs: z.string().trim().min(1),
    id: z.optional(z.string().uuid()),
    response_id: z.optional(z.string().uuid()),
    is_retry: z.optional(z.boolean()),
    web_search: z.optional(z.boolean()),
    files: z.optional(z.array(z.string()))
  }).parse(json);
  const files = b64files?.map((file) => {
    const blob = Buffer.from(file, "base64");
    return new File([blob], "image.png");
  });
  if (files) {
    const filechecks = await Promise.all(
      files.map(async (file) => {
        const dimensions = sizeof(Buffer.from(await file.arrayBuffer()));
        return file.size > 2 * 1024 * 1024 || (dimensions.width ?? 0) > 224 || (dimensions.height ?? 0) > 224;
      })
    );
    if (filechecks.some((check) => check)) {
      throw error(413, "File too large, should be <2MB and 224x224 max.");
    }
  }
  let hashes;
  if (files) {
    hashes = await Promise.all(files.map(async (file) => await uploadFile(file, conv)));
  }
  let messages = (() => {
    if (is_retry && messageId) {
      let retryMessageIdx = conv.messages.findIndex((message) => message.id === messageId);
      if (retryMessageIdx === -1) {
        retryMessageIdx = conv.messages.length;
      }
      return [
        ...conv.messages.slice(0, retryMessageIdx),
        {
          content: newPrompt,
          from: "user",
          id: messageId,
          updatedAt: /* @__PURE__ */ new Date(),
          files: conv.messages[retryMessageIdx]?.files
        }
      ];
    }
    return [
      ...conv.messages,
      {
        content: newPrompt,
        from: "user",
        id: messageId || crypto.randomUUID(),
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        files: hashes
      }
    ];
  })();
  await collections.conversations.updateOne(
    {
      _id: convId
    },
    {
      $set: {
        messages,
        title: conv.title,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }
  );
  const stream = new ReadableStream({
    async start(controller) {
      const updates = [];
      function update(newUpdate) {
        if (newUpdate.type !== "stream") {
          updates.push(newUpdate);
        }
        controller.enqueue(JSON.stringify(newUpdate) + "\n");
      }
      update({ type: "status", status: "started" });
      if (conv.title === "New Chat" && messages.length === 1) {
        try {
          conv.title = await summarize(newPrompt) ?? conv.title;
          update({ type: "status", status: "title", message: conv.title });
        } catch (e) {
          console.error(e);
        }
      }
      await collections.conversations.updateOne(
        {
          _id: convId
        },
        {
          $set: {
            messages,
            title: conv.title,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }
      );
      let webSearchResults;
      if (webSearch) {
        webSearchResults = await runWebSearch(conv, newPrompt, update);
      }
      messages[messages.length - 1].webSearch = webSearchResults;
      conv.messages = messages;
      try {
        const endpoint = await model.getEndpoint();
        for await (const output of await endpoint({ conversation: conv })) {
          if (!output.generated_text) {
            if (!output.token.special) {
              update({
                type: "stream",
                token: output.token.text
              });
              const lastMessage = messages[messages.length - 1];
              if (lastMessage?.from !== "assistant") {
                messages = [
                  ...messages,
                  // id doesn't match the backend id but it's not important for assistant messages
                  // First token has a space at the beginning, trim it
                  {
                    from: "assistant",
                    content: output.token.text.trimStart(),
                    webSearch: webSearchResults,
                    updates,
                    id: responseId || crypto.randomUUID(),
                    createdAt: /* @__PURE__ */ new Date(),
                    updatedAt: /* @__PURE__ */ new Date()
                  }
                ];
              } else {
                const date = abortedGenerations.get(convId.toString());
                if (date && date > promptedAt) {
                  break;
                }
                if (!output) {
                  break;
                }
                lastMessage.content += output.token.text;
              }
            }
          } else {
            messages = [
              ...messages.slice(0, -1),
              {
                ...messages[messages.length - 1],
                content: output.generated_text,
                updates,
                updatedAt: /* @__PURE__ */ new Date()
              }
            ];
          }
        }
      } catch (e) {
        console.error(e);
        update({ type: "status", status: "error", message: e.message });
      }
      await collections.conversations.updateOne(
        {
          _id: convId
        },
        {
          $set: {
            messages,
            title: conv?.title,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }
      );
      update({
        type: "finalAnswer",
        text: messages[messages.length - 1].content
      });
      return;
    },
    async cancel() {
      await collections.conversations.updateOne(
        {
          _id: convId
        },
        {
          $set: {
            messages,
            title: conv.title,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }
      );
    }
  });
  return new Response(stream);
}
async function DELETE({ locals, params }) {
  const convId = new ObjectId(params.id);
  const conv = await collections.conversations.findOne({
    _id: convId,
    ...authCondition(locals)
  });
  if (!conv) {
    throw error(404, "Conversation not found");
  }
  await collections.conversations.deleteOne({ _id: conv._id });
  return new Response();
}
async function PATCH({ request, locals, params }) {
  const { title } = z.object({ title: z.string().trim().min(1).max(100) }).parse(await request.json());
  const convId = new ObjectId(params.id);
  const conv = await collections.conversations.findOne({
    _id: convId,
    ...authCondition(locals)
  });
  if (!conv) {
    throw error(404, "Conversation not found");
  }
  await collections.conversations.updateOne(
    {
      _id: convId
    },
    {
      $set: {
        title
      }
    }
  );
  return new Response();
}
export {
  DELETE,
  PATCH,
  POST
};
