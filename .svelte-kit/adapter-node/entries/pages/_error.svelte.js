import { c as create_ssr_component, b as subscribe, g as escape } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<div class="flex items-center justify-center bg-gradient-to-t from-gray-200 text-gray-800 dark:from-gray-700 dark:text-gray-300"><div class="align-center -mt-24 flex flex-col justify-center rounded-xl border bg-white px-8 pb-2 pt-4 text-center dark:border-gray-700 dark:bg-gray-800"><h1 class="mb-2 text-5xl font-semibold">${escape($page.status)}</h1> <div class="-mx-8 my-2 h-px bg-gray-200 dark:bg-gray-700"></div> <h2 class="max-w-sm text-lg">${escape($page.error?.message)}</h2></div></div>`;
});
export {
  Error as default
};
