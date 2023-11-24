import { H as HF_ACCESS_TOKEN, O as OPENAI_API_KEY, a as MODELS, b as OLD_MODELS, c as HF_API_ROOT } from "./private.js";
import Handlebars from "handlebars";
import { z } from "zod";
import { format } from "date-fns";
import { d as downloadFile } from "./downloadFile.js";
import { textGenerationStream } from "@huggingface/inference";
Handlebars.registerHelper("ifUser", function(options) {
  if (this.from == "user")
    return options.fn(this);
});
Handlebars.registerHelper(
  "ifAssistant",
  function(options) {
    if (this.from == "assistant")
      return options.fn(this);
  }
);
function compileTemplate(input, model) {
  const template = Handlebars.compile(input, {
    knownHelpers: { ifUser: true, ifAssistant: true },
    knownHelpersOnly: true,
    noEscape: true,
    strict: true,
    preventIndent: true
  });
  return function render(inputs, options) {
    return template({ ...model, ...inputs }, options);
  };
}
async function buildPrompt({
  messages,
  model,
  webSearch,
  preprompt,
  id
}) {
  if (webSearch && webSearch.context) {
    const lastMsg = messages.slice(-1)[0];
    const messagesWithoutLastUsrMsg = messages.slice(0, -1);
    const previousUserMessages = messages.filter((el) => el.from === "user").slice(0, -1);
    const previousQuestions = previousUserMessages.length > 0 ? `Previous questions: 
${previousUserMessages.map(({ content }) => `- ${content}`).join("\n")}` : "";
    const currentDate = format(/* @__PURE__ */ new Date(), "MMMM d, yyyy");
    messages = [
      ...messagesWithoutLastUsrMsg,
      {
        from: "user",
        content: `I searched the web using the query: ${webSearch.searchQuery}. Today is ${currentDate} and here are the results:
				=====================
				${webSearch.context}
				=====================
				${previousQuestions}
				Answer the question: ${lastMsg.content} 
				`
      }
    ];
  }
  if (model.multimodal) {
    messages = await Promise.all(
      messages.map(async (el) => {
        let content = el.content;
        if (el.from === "user") {
          if (el?.files && el.files.length > 0 && id) {
            const markdowns = await Promise.all(
              el.files.map(async (hash) => {
                try {
                  const { content: image, mime } = await downloadFile(hash, id);
                  const b64 = image.toString("base64");
                  return `![](data:${mime};base64,${b64})})`;
                } catch (e) {
                  console.error(e);
                }
              })
            );
            content += markdowns.join("\n ");
          } else {
            content += "\n![](data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAQABADAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/igAoAKACgD/2Q==)";
          }
        }
        return { ...el, content };
      })
    );
  }
  return model.chatPromptRender({ messages, preprompt }).split(" ").slice(-(model.parameters?.truncate ?? 0)).join(" ");
}
const endpointTgiParametersSchema = z.object({
  weight: z.number().int().positive().default(1),
  model: z.any(),
  type: z.literal("tgi"),
  url: z.string().url(),
  accessToken: z.string().default(HF_ACCESS_TOKEN)
});
function endpointTgi({
  url,
  accessToken,
  model
}) {
  return async ({ conversation }) => {
    const prompt = await buildPrompt({
      messages: conversation.messages,
      webSearch: conversation.messages[conversation.messages.length - 1].webSearch,
      preprompt: conversation.preprompt,
      model,
      id: conversation._id
    });
    return textGenerationStream(
      {
        parameters: { ...model.parameters, return_full_text: false },
        model: url,
        inputs: prompt,
        accessToken
      },
      { use_cache: false }
    );
  };
}
const endpointAwsParametersSchema = z.object({
  weight: z.number().int().positive().default(1),
  model: z.any(),
  type: z.literal("aws"),
  url: z.string().url(),
  accessKey: z.string().min(1),
  secretKey: z.string().min(1),
  sessionToken: z.string().optional(),
  service: z.union([z.literal("sagemaker"), z.literal("lambda")]).default("sagemaker"),
  region: z.string().optional()
});
async function endpointAws({
  url,
  accessKey,
  secretKey,
  sessionToken,
  model,
  region,
  service
}) {
  let AwsClient;
  try {
    AwsClient = (await import("aws4fetch")).AwsClient;
  } catch (e) {
    throw new Error("Failed to import aws4fetch");
  }
  const aws = new AwsClient({
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    sessionToken,
    service,
    region
  });
  return async ({ conversation }) => {
    const prompt = await buildPrompt({
      messages: conversation.messages,
      webSearch: conversation.messages[conversation.messages.length - 1].webSearch,
      preprompt: conversation.preprompt,
      model
    });
    return textGenerationStream(
      {
        parameters: { ...model.parameters, return_full_text: false },
        model: url,
        inputs: prompt
      },
      {
        use_cache: false,
        fetch: aws.fetch.bind(aws)
      }
    );
  };
}
async function* openAICompletionToTextGenerationStream(completionStream) {
  let generatedText = "";
  let tokenId = 0;
  for await (const completion of completionStream) {
    const { choices } = completion;
    const text = choices[0]?.text ?? "";
    const last = choices[0]?.finish_reason === "stop";
    if (text) {
      generatedText = generatedText + text;
    }
    const output = {
      token: {
        id: tokenId++,
        text,
        logprob: 0,
        special: false
      },
      generated_text: last ? generatedText : null,
      details: null
    };
    yield output;
  }
}
async function* openAIChatToTextGenerationStream(completionStream) {
  let generatedText = "";
  let tokenId = 0;
  for await (const completion of completionStream) {
    const { choices } = completion;
    const content = choices[0]?.delta?.content ?? "";
    const last = choices[0]?.finish_reason === "stop";
    if (content) {
      generatedText = generatedText + content;
    }
    const output = {
      token: {
        id: tokenId++,
        text: content ?? "",
        logprob: 0,
        special: false
      },
      generated_text: last ? generatedText : null,
      details: null
    };
    yield output;
  }
}
const endpointOAIParametersSchema = z.object({
  weight: z.number().int().positive().default(1),
  model: z.any(),
  type: z.literal("openai"),
  baseURL: z.string().url().default("https://api.openai.com/v1"),
  apiKey: z.string().default(OPENAI_API_KEY),
  completion: z.union([z.literal("completions"), z.literal("chat_completions")]).default("chat_completions")
});
async function endpointOai({
  baseURL,
  apiKey,
  completion,
  model
}) {
  let OpenAI;
  try {
    OpenAI = (await import("openai")).OpenAI;
  } catch (e) {
    throw new Error("Failed to import OpenAI", { cause: e });
  }
  const openai = new OpenAI({
    apiKey: apiKey ?? "sk-",
    baseURL
  });
  if (completion === "completions") {
    return async ({ conversation }) => {
      return openAICompletionToTextGenerationStream(
        await openai.completions.create({
          model: model.id ?? model.name,
          prompt: await buildPrompt({
            messages: conversation.messages,
            webSearch: conversation.messages[conversation.messages.length - 1].webSearch,
            preprompt: conversation.preprompt,
            model
          }),
          stream: true,
          max_tokens: model.parameters?.max_new_tokens,
          stop: model.parameters?.stop,
          temperature: model.parameters?.temperature,
          top_p: model.parameters?.top_p,
          frequency_penalty: model.parameters?.repetition_penalty
        })
      );
    };
  } else if (completion === "chat_completions") {
    return async ({ conversation }) => {
      const messages = conversation.messages.map((message) => ({
        role: message.from,
        content: message.content
      }));
      return openAIChatToTextGenerationStream(
        await openai.chat.completions.create({
          model: model.id ?? model.name,
          messages: conversation.preprompt ? [{ role: "system", content: conversation.preprompt }, ...messages] : messages,
          stream: true,
          max_tokens: model.parameters?.max_new_tokens,
          stop: model.parameters?.stop,
          temperature: model.parameters?.temperature,
          top_p: model.parameters?.top_p,
          frequency_penalty: model.parameters?.repetition_penalty
        })
      );
    };
  } else {
    throw new Error("Invalid completion type");
  }
}
const endpointLlamacppParametersSchema = z.object({
  weight: z.number().int().positive().default(1),
  model: z.any(),
  type: z.literal("llamacpp"),
  url: z.string().url().default("http://127.0.0.1:8080"),
  accessToken: z.string().min(1).default(HF_ACCESS_TOKEN)
});
function endpointLlamacpp({
  url,
  model
}) {
  return async ({ conversation }) => {
    const prompt = await buildPrompt({
      messages: conversation.messages,
      webSearch: conversation.messages[conversation.messages.length - 1].webSearch,
      preprompt: conversation.preprompt,
      model
    });
    const r = await fetch(`${url}/completion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        stream: true,
        temperature: model.parameters.temperature,
        top_p: model.parameters.top_p,
        top_k: model.parameters.top_k,
        stop: model.parameters.stop,
        repeat_penalty: model.parameters.repetition_penalty,
        n_predict: model.parameters.max_new_tokens
      })
    });
    if (!r.ok) {
      throw new Error(`Failed to generate text: ${await r.text()}`);
    }
    const encoder = new TextDecoderStream();
    const reader = r.body?.pipeThrough(encoder).getReader();
    return async function* () {
      let stop = false;
      let generatedText = "";
      let tokenId = 0;
      while (!stop) {
        const out = await reader?.read() ?? { done: false, value: void 0 };
        if (out.done) {
          reader?.cancel();
          return;
        }
        if (!out.value) {
          return;
        }
        if (out.value.startsWith("data: ")) {
          let data = null;
          try {
            data = JSON.parse(out.value.slice(6));
          } catch (e) {
            return;
          }
          if (data.content || data.stop) {
            generatedText += data.content;
            const output = {
              token: {
                id: tokenId++,
                text: data.content ?? "",
                logprob: 0,
                special: false
              },
              generated_text: data.stop ? generatedText : null,
              details: null
            };
            if (data.stop) {
              stop = true;
              reader?.cancel();
            }
            yield output;
          }
        }
      }
    }();
  };
}
const endpointOllamaParametersSchema = z.object({
  weight: z.number().int().positive().default(1),
  model: z.any(),
  type: z.literal("ollama"),
  url: z.string().url().default("http://127.0.0.1:11434"),
  ollamaName: z.string().min(1).optional()
});
function endpointOllama({
  url,
  model,
  ollamaName
}) {
  return async ({ conversation }) => {
    const prompt = await buildPrompt({
      messages: conversation.messages,
      webSearch: conversation.messages[conversation.messages.length - 1].webSearch,
      preprompt: conversation.preprompt,
      model
    });
    const r = await fetch(`${url}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        model: ollamaName ?? model.name,
        raw: true,
        options: {
          top_p: model.parameters.top_p,
          top_k: model.parameters.top_k,
          temperature: model.parameters.temperature,
          repeat_penalty: model.parameters.repetition_penalty,
          stop: model.parameters.stop,
          num_predict: model.parameters.max_new_tokens
        }
      })
    });
    if (!r.ok) {
      throw new Error(`Failed to generate text: ${await r.text()}`);
    }
    const encoder = new TextDecoderStream();
    const reader = r.body?.pipeThrough(encoder).getReader();
    return async function* () {
      let generatedText = "";
      let tokenId = 0;
      let stop = false;
      while (!stop) {
        const out = await reader?.read() ?? { done: false, value: void 0 };
        if (out.done) {
          reader?.cancel();
          return;
        }
        if (!out.value) {
          return;
        }
        let data = null;
        try {
          data = JSON.parse(out.value);
        } catch (e) {
          return;
        }
        if (!data.done) {
          generatedText += data.response;
          yield {
            token: {
              id: tokenId++,
              text: data.response ?? "",
              logprob: 0,
              special: false
            },
            generated_text: null,
            details: null
          };
        } else {
          stop = true;
          yield {
            token: {
              id: tokenId++,
              text: data.response ?? "",
              logprob: 0,
              special: true
            },
            generated_text: generatedText,
            details: null
          };
        }
      }
    }();
  };
}
const endpoints = {
  tgi: endpointTgi,
  aws: endpointAws,
  openai: endpointOai,
  llamacpp: endpointLlamacpp,
  ollama: endpointOllama
};
const endpointSchema = z.discriminatedUnion("type", [
  endpointAwsParametersSchema,
  endpointOAIParametersSchema,
  endpointTgiParametersSchema,
  endpointLlamacppParametersSchema,
  endpointOllamaParametersSchema
]);
function sum(nums) {
  return nums.reduce((a, b) => a + b, 0);
}
const modelConfig = z.object({
  /** Used as an identifier in DB */
  id: z.string().optional(),
  /** Used to link to the model page, and for inference */
  name: z.string().min(1),
  displayName: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  websiteUrl: z.string().url().optional(),
  modelUrl: z.string().url().optional(),
  datasetName: z.string().min(1).optional(),
  datasetUrl: z.string().url().optional(),
  userMessageToken: z.string().default(""),
  userMessageEndToken: z.string().default(""),
  assistantMessageToken: z.string().default(""),
  assistantMessageEndToken: z.string().default(""),
  messageEndToken: z.string().default(""),
  preprompt: z.string().default(""),
  prepromptUrl: z.string().url().optional(),
  chatPromptTemplate: z.string().default(
    "{{preprompt}}{{#each messages}}{{#ifUser}}{{@root.userMessageToken}}{{content}}{{@root.userMessageEndToken}}{{/ifUser}}{{#ifAssistant}}{{@root.assistantMessageToken}}{{content}}{{@root.assistantMessageEndToken}}{{/ifAssistant}}{{/each}}{{assistantMessageToken}}"
  ),
  promptExamples: z.array(
    z.object({
      title: z.string().min(1),
      prompt: z.string().min(1)
    })
  ).optional(),
  endpoints: z.array(endpointSchema).optional(),
  parameters: z.object({
    temperature: z.number().min(0).max(1),
    truncate: z.number().int().positive().optional(),
    max_new_tokens: z.number().int().positive(),
    stop: z.array(z.string()).optional(),
    top_p: z.number().positive().optional(),
    top_k: z.number().positive().optional(),
    repetition_penalty: z.number().min(-2).max(2).optional()
  }).passthrough().optional(),
  multimodal: z.boolean().default(false)
});
const modelsRaw = z.array(modelConfig).parse(JSON.parse(MODELS));
const processModel = async (m) => ({
  ...m,
  userMessageEndToken: m?.userMessageEndToken || m?.messageEndToken,
  assistantMessageEndToken: m?.assistantMessageEndToken || m?.messageEndToken,
  chatPromptRender: compileTemplate(m.chatPromptTemplate, m),
  id: m.id || m.name,
  displayName: m.displayName || m.name,
  preprompt: m.prepromptUrl ? await fetch(m.prepromptUrl).then((r) => r.text()) : m.preprompt,
  parameters: { ...m.parameters, stop_sequences: m.parameters?.stop }
});
const addEndpoint = (m) => ({
  ...m,
  getEndpoint: async () => {
    if (!m.endpoints) {
      return endpointTgi({
        type: "tgi",
        url: `${HF_API_ROOT}/${m.name}`,
        accessToken: HF_ACCESS_TOKEN,
        weight: 1,
        model: m
      });
    }
    const totalWeight = sum(m.endpoints.map((e) => e.weight));
    let random = Math.random() * totalWeight;
    for (const endpoint of m.endpoints) {
      if (random < endpoint.weight) {
        const args = { ...endpoint, model: m };
        switch (args.type) {
          case "tgi":
            return endpoints.tgi(args);
          case "aws":
            return await endpoints.aws(args);
          case "openai":
            return await endpoints.openai(args);
          case "llamacpp":
            return endpoints.llamacpp(args);
          case "ollama":
            return endpoints.ollama(args);
          default:
            return endpoints.tgi(args);
        }
      }
      random -= endpoint.weight;
    }
    throw new Error(`Failed to select endpoint`);
  }
});
const models = await Promise.all(modelsRaw.map((e) => processModel(e).then(addEndpoint)));
const defaultModel = models[0];
const oldModels = z.array(
  z.object({
    id: z.string().optional(),
    name: z.string().min(1),
    displayName: z.string().min(1).optional()
  })
).parse(JSON.parse(OLD_MODELS)).map((m) => ({ ...m, id: m.id || m.name, displayName: m.displayName || m.name }));
const validateModel = (_models) => {
  return z.enum([_models[0].id, ..._models.slice(1).map((m) => m.id)]);
};
const smallModel = defaultModel;
export {
  buildPrompt as b,
  defaultModel as d,
  models as m,
  oldModels as o,
  smallModel as s,
  validateModel as v
};
