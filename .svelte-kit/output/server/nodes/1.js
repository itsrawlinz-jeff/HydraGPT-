

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.da92feb3.js","_app/immutable/chunks/scheduler.953cfe2b.js","_app/immutable/chunks/index.1fa04a18.js","_app/immutable/chunks/stores.2ffbda4a.js","_app/immutable/chunks/singletons.021c165b.js"];
export const stylesheets = [];
export const fonts = [];
