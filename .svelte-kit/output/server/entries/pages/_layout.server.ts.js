import { r as redirect } from "../../chunks/index.js";
import { c as collections } from "../../chunks/database.js";
import { U as UrlDependency } from "../../chunks/UrlDependency.js";
import { v as validateModel, d as defaultModel, m as models, o as oldModels } from "../../chunks/models.js";
import { a as authCondition, r as requiresUser } from "../../chunks/auth.js";
import { D as DEFAULT_SETTINGS } from "../../chunks/Settings.js";
import { U as USE_LOCAL_WEBSEARCH } from "../../chunks/private.js";
const load = async ({ locals, depends, url }) => {
  const { conversations } = collections;
  const urlModel = url.searchParams.get("model");
  depends(UrlDependency.ConversationList);
  if (urlModel) {
    const isValidModel = validateModel(models).safeParse(urlModel).success;
    if (isValidModel) {
      await collections.settings.updateOne(
        authCondition(locals),
        { $set: { activeModel: urlModel } },
        { upsert: true }
      );
    }
    throw redirect(302, url.pathname);
  }
  const settings = await collections.settings.findOne(authCondition(locals));
  if (settings && !validateModel(models).safeParse(settings?.activeModel).success) {
    settings.activeModel = defaultModel.id;
    await collections.settings.updateOne(authCondition(locals), {
      $set: { activeModel: defaultModel.id }
    });
  }
  const totalMessages = (await conversations.aggregate([
    { $match: authCondition(locals) },
    { $project: { messages: 1 } },
    { $unwind: "$messages" },
    { $match: { "messages.from": "assistant" } },
    { $count: "messages" }
  ]).toArray())[0]?.messages ?? 0;
  const messagesBeforeLogin = 0;
  const userHasExceededMessages = messagesBeforeLogin > 0 && totalMessages > messagesBeforeLogin;
  const loginRequired = requiresUser && !locals.user && userHasExceededMessages;
  return {
    conversations: await conversations.find(authCondition(locals)).sort({ updatedAt: -1 }).project({
      title: 1,
      model: 1,
      _id: 1,
      updatedAt: 1,
      createdAt: 1
    }).map((conv) => ({
      id: conv._id.toString(),
      title: settings?.hideEmojiOnSidebar ? conv.title.replace(/\p{Emoji}/gu, "") : conv.title,
      model: conv.model ?? defaultModel
    })).toArray(),
    settings: {
      shareConversationsWithModelAuthors: settings?.shareConversationsWithModelAuthors ?? DEFAULT_SETTINGS.shareConversationsWithModelAuthors,
      ethicsModalAcceptedAt: settings?.ethicsModalAcceptedAt ?? null,
      activeModel: settings?.activeModel ?? DEFAULT_SETTINGS.activeModel,
      hideEmojiOnSidebar: settings?.hideEmojiOnSidebar ?? false,
      searchEnabled: !!USE_LOCAL_WEBSEARCH,
      customPrompts: settings?.customPrompts ?? {}
    },
    models: models.map((model) => ({
      id: model.id,
      name: model.name,
      websiteUrl: model.websiteUrl,
      modelUrl: model.modelUrl,
      datasetName: model.datasetName,
      datasetUrl: model.datasetUrl,
      displayName: model.displayName,
      description: model.description,
      promptExamples: model.promptExamples,
      parameters: model.parameters,
      preprompt: model.preprompt,
      multimodal: model.multimodal
    })),
    oldModels,
    user: locals.user && {
      username: locals.user.username,
      avatarUrl: locals.user.avatarUrl,
      email: locals.user.email
    },
    loginRequired,
    loginEnabled: requiresUser,
    guestMode: requiresUser && messagesBeforeLogin > 0
  };
};
export {
  load
};
