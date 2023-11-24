import { c as create_ssr_component, a as spread, e as escape_object, b as subscribe, d as createEventDispatcher, f as add_attribute, v as validate_component, g as escape, h as each, o as onDestroy, i as set_store_value } from "../../chunks/ssr.js";
import { b as base } from "../../chunks/paths.js";
import { n as navigating, p as page } from "../../chunks/stores.js";
import { P as PUBLIC_ORIGIN, a as PUBLIC_APP_NAME, b as PUBLIC_APP_ASSETS } from "../../chunks/public.js";
import { e as error } from "../../chunks/errors.js";
import { b as browser } from "../../chunks/environment.js";
import { C as Close, L as Logo } from "../../chunks/Logo.js";
import "devalue";
import { t as titleUpdate } from "../../chunks/titleUpdate.js";
const main = "";
const Add = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 32 32" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="currentColor" d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z"/>`}<!-- HTML_TAG_END --></svg>`;
});
const Text_align_justify = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 32 32" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="currentColor" d="M6 6h20v2H6zm0 6h20v2H6zm0 6h20v2H6zm0 6h20v2H6z"/>`}<!-- HTML_TAG_END --></svg>`;
});
const MobileNav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $navigating, $$unsubscribe_navigating;
  $$unsubscribe_navigating = subscribe(navigating, (value) => $navigating = value);
  let { isOpen = false } = $$props;
  let { title } = $$props;
  let closeEl;
  let openEl;
  const dispatch = createEventDispatcher();
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  title = title || "New Chat";
  {
    if ($navigating) {
      dispatch("toggle", false);
    }
  }
  {
    if (isOpen && closeEl) {
      closeEl.focus();
    } else if (!isOpen && browser && document.activeElement === closeEl) {
      openEl.focus();
    }
  }
  $$unsubscribe_navigating();
  return `<nav class="flex h-12 items-center justify-between border-b bg-gray-50 px-4 dark:border-gray-800 dark:bg-gray-800/70 md:hidden"><button type="button" class="-ml-3 flex h-9 w-9 shrink-0 items-center justify-center" aria-label="Open menu"${add_attribute("this", openEl, 0)}>${validate_component(Text_align_justify, "CarbonTextAlignJustify").$$render($$result, {}, {}, {})}</button> <span class="truncate px-4">${escape(title)}</span> <a${add_attribute("href", `${base}/`, 0)} class="-mr-3 flex h-9 w-9 shrink-0 items-center justify-center">${validate_component(Add, "CarbonAdd").$$render($$result, {}, {}, {})}</a></nav> <nav class="${"fixed inset-0 z-30 grid max-h-screen grid-cols-1 grid-rows-[auto,auto,1fr,auto] bg-white bg-gradient-to-l from-gray-50 dark:bg-gray-900 dark:from-gray-800/30 max-sm:rounded-t-2xl " + escape(isOpen ? "block" : "hidden", true)}"><div class="flex h-12 items-center px-4"><button type="button" class="-mr-3 ml-auto flex h-9 w-9 items-center justify-center" aria-label="Close menu"${add_attribute("this", closeEl, 0)}>${validate_component(Close, "CarbonClose").$$render($$result, {}, {}, {})}</button></div> ${slots.default ? slots.default({}) : ``}</nav>`;
});
const Trash_can = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 32 32" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="currentColor" d="M12 12h2v12h-2zm6 0h2v12h-2z"/><path fill="currentColor" d="M4 6v2h2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h2V6zm4 22V8h16v20zm4-26h8v2h-8z"/>`}<!-- HTML_TAG_END --></svg>`;
});
const Edit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 32 32" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="currentColor" d="M2 26h28v2H2zM25.4 9c.8-.8.8-2 0-2.8l-3.6-3.6c-.8-.8-2-.8-2.8 0l-15 15V24h6.4l15-15zm-5-5L24 7.6l-3 3L17.4 7l3-3zM6 22v-3.6l10-10l3.6 3.6l-10 10H6z"/>`}<!-- HTML_TAG_END --></svg>`;
});
const NavConversationItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { conv } = $$props;
  createEventDispatcher();
  if ($$props.conv === void 0 && $$bindings.conv && conv !== void 0)
    $$bindings.conv(conv);
  $$unsubscribe_page();
  return `<a data-sveltekit-noscroll href="${escape(base, true) + "/conversation/" + escape(conv.id, true)}" class="${"group flex h-11 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 " + escape(
    conv.id === $page.params.id ? "bg-gray-100 dark:bg-gray-700" : "",
    true
  )}"><div class="flex-1 truncate">${``} ${escape(conv.title)}</div> ${`<button type="button" class="flex h-5 w-5 items-center justify-center rounded md:hidden md:group-hover:flex" title="Edit conversation title">${validate_component(Edit, "CarbonEdit").$$render(
    $$result,
    {
      class: "text-xs text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
    },
    {},
    {}
  )}</button> <button type="button" class="flex h-5 w-5 items-center justify-center rounded md:hidden md:group-hover:flex" title="Delete conversation">${validate_component(Trash_can, "CarbonTrashCan").$$render(
    $$result,
    {
      class: "text-xs text-gray-400  hover:text-gray-500 dark:hover:text-gray-300"
    },
    {},
    {}
  )}</button>`}</a>`;
});
const NavMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let { conversations = [] } = $$props;
  let { canLogin } = $$props;
  let { user } = $$props;
  if ($$props.conversations === void 0 && $$bindings.conversations && conversations !== void 0)
    $$bindings.conversations(conversations);
  if ($$props.canLogin === void 0 && $$bindings.canLogin && canLogin !== void 0)
    $$bindings.canLogin(canLogin);
  if ($$props.user === void 0 && $$bindings.user && user !== void 0)
    $$bindings.user(user);
  return `<div class="sticky top-0 flex flex-none items-center justify-between px-3 py-3.5 max-sm:pt-0"><a class="flex items-center rounded-xl text-lg font-semibold" href="${escape(PUBLIC_ORIGIN, true) + escape(base, true) + "/"}">${validate_component(Logo, "Logo").$$render($$result, { classNames: "mr-1" }, {}, {})} ${escape(PUBLIC_APP_NAME)}</a> <a${add_attribute("href", `${base}/`, 0)} class="flex rounded-lg border bg-white px-2 py-0.5 text-center shadow-sm hover:shadow-none dark:border-gray-600 dark:bg-gray-700" data-svelte-h="svelte-111q0zn">New Chat</a></div> <div class="scrollbar-custom flex flex-col gap-1 overflow-y-auto rounded-r-xl bg-gradient-to-l from-gray-50 px-3 pb-3 pt-2 dark:from-gray-800/30">${each(conversations, (conv) => {
    return `${validate_component(NavConversationItem, "NavConversationItem").$$render($$result, { conv }, {}, {})}`;
  })}</div> <div class="mt-0.5 flex flex-col gap-1 rounded-r-xl bg-gradient-to-l from-gray-50 p-3 text-sm dark:from-gray-800/30">${user?.username || user?.email ? `<form action="${escape(base, true) + "/logout"}" method="post" class="group flex items-center gap-1.5 rounded-lg pl-3 pr-2 hover:bg-gray-100 dark:hover:bg-gray-700"><span class="flex h-9 flex-none shrink items-center gap-1.5 truncate pr-2 text-gray-500 dark:text-gray-400">${escape(user?.username || user?.email)}</span> <button type="submit" class="ml-auto h-6 flex-none items-center gap-1.5 rounded-md border bg-white px-2 text-gray-700 shadow-sm group-hover:flex hover:shadow-none dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400 dark:hover:text-gray-300 md:hidden" data-svelte-h="svelte-3rftc">Sign Out</button></form>` : ``} ${canLogin ? `<form action="${escape(base, true) + "/login"}" method="POST" target="_parent" data-svelte-h="svelte-7nu686"><button type="submit" class="flex h-9 w-full flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">Login</button></form>` : ``} <button type="button" class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700" data-svelte-h="svelte-iicrsj">Theme</button> <button type="button" class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700" data-svelte-h="svelte-1drr7pi">Settings</button> ${``}</div>`;
});
const IconDazzled = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { classNames = "" } = $$props;
  if ($$props.classNames === void 0 && $$bindings.classNames && classNames !== void 0)
    $$bindings.classNames(classNames);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"${add_attribute("class", classNames, 0)} fill="none" viewBox="0 0 26 23"><path fill="url(#a)" d="M.93 10.65A10.17 10.17 0 0 1 11.11.48h4.67a9.45 9.45 0 0 1 0 18.89H4.53L1.62 22.2a.38.38 0 0 1-.69-.28V10.65Z"></path><path fill="#000" fill-rule="evenodd" d="M11.52 7.4a1.86 1.86 0 1 1-3.72 0 1.86 1.86 0 0 1 3.72 0Zm7.57 0a1.86 1.86 0 1 1-3.73 0 1.86 1.86 0 0 1 3.73 0ZM8.9 12.9a.55.55 0 0 0-.11.35.76.76 0 0 1-1.51 0c0-.95.67-1.94 1.76-1.94 1.09 0 1.76 1 1.76 1.94H9.3a.55.55 0 0 0-.12-.35c-.06-.07-.1-.08-.13-.08s-.08 0-.14.08Zm4.04 0a.55.55 0 0 0-.12.35h-1.51c0-.95.68-1.94 1.76-1.94 1.1 0 1.77 1 1.77 1.94h-1.51a.55.55 0 0 0-.12-.35c-.06-.07-.11-.08-.14-.08-.02 0-.07 0-.13.08Zm-1.89.79c-.02 0-.07-.01-.13-.08a.55.55 0 0 1-.12-.36h-1.5c0 .95.67 1.95 1.75 1.95 1.1 0 1.77-1 1.77-1.95h-1.51c0 .16-.06.28-.12.36-.06.07-.11.08-.14.08Zm4.04 0c-.03 0-.08-.01-.14-.08a.55.55 0 0 1-.12-.36h-1.5c0 .95.67 1.95 1.76 1.95 1.08 0 1.76-1 1.76-1.95h-1.51c0 .16-.06.28-.12.36-.06.07-.11.08-.13.08Zm1.76-.44c0-.16.05-.28.12-.35.06-.07.1-.08.13-.08s.08 0 .14.08c.06.07.11.2.11.35a.76.76 0 0 0 1.51 0c0-.95-.67-1.94-1.76-1.94-1.09 0-1.76 1-1.76 1.94h1.5Z" clip-rule="evenodd"></path><defs><radialGradient id="a" cx="0" cy="0" r="1" gradientTransform="matrix(0 31.37 -34.85 0 13.08 -9.02)" gradientUnits="userSpaceOnUse"><stop stop-color="#FFD21E"></stop><stop offset="1" stop-color="red"></stop></radialGradient></defs></svg>`;
});
const Toast = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { message = "" } = $$props;
  if ($$props.message === void 0 && $$bindings.message && message !== void 0)
    $$bindings.message(message);
  return `<div class="pointer-events-none fixed right-0 top-12 z-20 bg-gradient-to-bl from-red-500/20 via-red-500/0 to-red-500/0 pb-36 pl-36 pr-2 pt-2 md:top-0 md:pr-8 md:pt-5"><div class="pointer-events-auto flex items-center rounded-full bg-white/90 px-3 py-1 shadow-sm dark:bg-gray-900/80">${validate_component(IconDazzled, "IconDazzled").$$render($$result, { classNames: "text-2xl mr-2" }, {}, {})} <h2 class="font-semibold">${escape(message)}</h2></div></div>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $titleUpdate, $$unsubscribe_titleUpdate;
  let $error, $$unsubscribe_error;
  let $page, $$unsubscribe_page;
  $$unsubscribe_titleUpdate = subscribe(titleUpdate, (value) => $titleUpdate = value);
  $$unsubscribe_error = subscribe(error, (value) => $error = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { data } = $$props;
  let isNavOpen = false;
  let errorToastTimeout;
  let currentError;
  async function onError() {
    if ($error && currentError && $error !== currentError) {
      clearTimeout(errorToastTimeout);
      currentError = null;
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    currentError = $error;
    errorToastTimeout = setTimeout(
      () => {
        set_store_value(error, $error = null, $error);
        currentError = null;
      },
      3e3
    );
  }
  onDestroy(() => {
    clearTimeout(errorToastTimeout);
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  {
    if ($error)
      onError();
  }
  {
    if ($titleUpdate) {
      const convIdx = data.conversations.findIndex(({ id }) => id === $titleUpdate?.convId);
      if (convIdx != -1) {
        data.conversations[convIdx].title = $titleUpdate?.title ?? data.conversations[convIdx].title;
      }
      data.conversations = [...data.conversations];
      set_store_value(titleUpdate, $titleUpdate = null, $titleUpdate);
    }
  }
  $$unsubscribe_titleUpdate();
  $$unsubscribe_error();
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-te1x4x_START -->${$$result.title = `<title>${escape(PUBLIC_APP_NAME)}</title>`, ""}<meta name="description" content="The first open source alternative to ChatGPT. 💪"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@huggingface"><meta property="og:title"${add_attribute("content", PUBLIC_APP_NAME, 0)}><meta property="og:type" content="website"><meta property="og:url" content="${escape($page.url.origin, true) + escape(base, true)}"><meta property="og:image" content="${escape($page.url.origin, true) + escape(base, true) + "/" + escape(PUBLIC_APP_ASSETS, true) + "/thumbnail.png"}"><link rel="icon" href="${escape($page.url.origin, true) + escape(base, true) + "/" + escape(PUBLIC_APP_ASSETS, true) + "/favicon.ico"}" sizes="32x32"><link rel="icon" href="${escape($page.url.origin, true) + escape(base, true) + "/" + escape(PUBLIC_APP_ASSETS, true) + "/icon.svg"}" type="image/svg+xml"><link rel="apple-touch-icon" href="${escape($page.url.origin, true) + escape(base, true) + "/" + escape(PUBLIC_APP_ASSETS, true) + "/apple-touch-icon.png"}"><link rel="manifest" href="${escape($page.url.origin, true) + escape(base, true) + "/" + escape(PUBLIC_APP_ASSETS, true) + "/manifest.json"}"><!-- HEAD_svelte-te1x4x_END -->`, ""} <div class="grid h-full w-screen grid-cols-1 grid-rows-[auto,1fr] overflow-hidden text-smd dark:text-gray-300 md:grid-cols-[280px,1fr] md:grid-rows-[1fr]">${validate_component(MobileNav, "MobileNav").$$render(
    $$result,
    {
      isOpen: isNavOpen,
      title: data.conversations.find((conv) => conv.id === $page.params.id)?.title
    },
    {},
    {
      default: () => {
        return `${validate_component(NavMenu, "NavMenu").$$render(
          $$result,
          {
            conversations: data.conversations,
            user: data.user,
            canLogin: data.user === void 0 && data.loginEnabled
          },
          {},
          {}
        )}`;
      }
    }
  )} <nav class="grid max-h-screen grid-cols-1 grid-rows-[auto,1fr,auto] max-md:hidden">${validate_component(NavMenu, "NavMenu").$$render(
    $$result,
    {
      conversations: data.conversations,
      user: data.user,
      canLogin: data.user === void 0 && data.loginEnabled
    },
    {},
    {}
  )}</nav> ${currentError ? `${validate_component(Toast, "Toast").$$render($$result, { message: currentError }, {}, {})}` : ``} ${``} ${slots.default ? slots.default({}) : ``}</div>`;
});
export {
  Layout as default
};
