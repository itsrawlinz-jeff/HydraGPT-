const MONGODB_URL = "mongodb+srv://rawlinz:rAqShQbVc2C6kLt7@cluster0.ogdlrcn.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB_NAME = "chat-ui";
const MONGODB_DIRECT_CONNECTION = "false";
const COOKIE_NAME = "hf-chat";
const HF_ACCESS_TOKEN = "";
const HF_API_ROOT = "https://api-inference.huggingface.co/models";
const OPENAI_API_KEY = "";
const USE_LOCAL_WEBSEARCH = "";
const OPENID_CONFIG = '{\n  "PROVIDER_URL": "",\n  "CLIENT_ID": "",\n  "CLIENT_SECRET": "",\n  "SCOPES": ""\n}';
const OPENID_CLIENT_ID = "";
const OPENID_CLIENT_SECRET = "";
const OPENID_SCOPES = "openid profile";
const OPENID_PROVIDER_URL = "https://huggingface.co";
const OPENID_TOLERANCE = "";
const OPENID_RESOURCE = "";
const MODELS = '[\n  {\n    "name": "HydraGPT-70B",\n    "description": "Llama 70B-chat",\n    "websiteUrl": "https://ai.meta.com/resources/models-and-libraries/llama-downloads/",\n    "userMessageToken": "",\n    "userMessageEndToken": " [/INST]",\n    "assistantMessageToken": "",\n    "assistantMessageEndToken": " </s><s>[INST] ",\n    "chat Prompt Template" : "<s>[INST] <<SYS>>\\n{{preprompt}}\\n<</SYS>>\\n\\n{{#each messages}}{{#ifUser}}{{content}} [/INST] {{/ifUser}}{{#ifAssistant}}{{content}} </s><s>[INST] {{/ifAssistant}}{{/each}}",\n    "parameters": {\n      "temperature": 0.2,\n      "top_p": 0.95,\n      "repetition_penalty": 1.2,\n      "top_k": 50,\n      "truncate": 1000,\n      "max_new_tokens": 1024\n    },\n    "endpoints": [\n      {\n        "type": "tgi",\n        "url": "https://ufg6godx0xq7px-8080.proxy.runpod.net"\n      }\n    ]\n  }\n]';
const OLD_MODELS = "[]";
const MESSAGES_BEFORE_LOGIN = "";
export {
  COOKIE_NAME as C,
  HF_ACCESS_TOKEN as H,
  MESSAGES_BEFORE_LOGIN as M,
  OPENAI_API_KEY as O,
  USE_LOCAL_WEBSEARCH as U,
  MODELS as a,
  OLD_MODELS as b,
  HF_API_ROOT as c,
  MONGODB_URL as d,
  MONGODB_DIRECT_CONNECTION as e,
  MONGODB_DB_NAME as f,
  OPENID_CONFIG as g,
  OPENID_CLIENT_ID as h,
  OPENID_CLIENT_SECRET as i,
  OPENID_PROVIDER_URL as j,
  OPENID_SCOPES as k,
  OPENID_TOLERANCE as l,
  OPENID_RESOURCE as m
};
