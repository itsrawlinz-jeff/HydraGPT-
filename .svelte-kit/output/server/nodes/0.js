import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.af21a609.js","_app/immutable/chunks/scheduler.953cfe2b.js","_app/immutable/chunks/index.1fa04a18.js","_app/immutable/chunks/forms.af2b0274.js","_app/immutable/chunks/singletons.021c165b.js","_app/immutable/chunks/stores.2ffbda4a.js","_app/immutable/chunks/parse.bee59afc.js","_app/immutable/chunks/titleUpdate.5d1a632c.js"];
export const stylesheets = ["_app/immutable/assets/0.42a1e4fb.css"];
export const fonts = [];
