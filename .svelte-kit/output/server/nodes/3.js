import * as server from '../entries/pages/conversation/_id_/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/conversation/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/conversation/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.687ab424.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/scheduler.953cfe2b.js","_app/immutable/chunks/index.1fa04a18.js","_app/immutable/chunks/pendingMessage.dfacf87f.js","_app/immutable/chunks/forms.af2b0274.js","_app/immutable/chunks/singletons.021c165b.js","_app/immutable/chunks/stores.2ffbda4a.js","_app/immutable/chunks/parse.bee59afc.js","_app/immutable/chunks/marked.esm.76161808.js","_app/immutable/chunks/titleUpdate.5d1a632c.js"];
export const stylesheets = ["_app/immutable/assets/pendingMessage.9da0802e.css"];
export const fonts = [];
