import { c as create_ssr_component, s as setContext, v as validate_component, m as missing_component } from "./ssr.js";
import "./paths.js";
let public_env = {};
function set_private_env(environment) {
}
function set_public_env(environment) {
  public_env = environment;
}
function afterUpdate() {
}
function set_building() {
}
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { constructors } = $$props;
  let { components = [] } = $$props;
  let { form } = $$props;
  let { data_0 = null } = $$props;
  let { data_1 = null } = $$props;
  {
    setContext("__svelte__", stores);
  }
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.constructors === void 0 && $$bindings.constructors && constructors !== void 0)
    $$bindings.constructors(constructors);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.data_0 === void 0 && $$bindings.data_0 && data_0 !== void 0)
    $$bindings.data_0(data_0);
  if ($$props.data_1 === void 0 && $$bindings.data_1 && data_1 !== void 0)
    $$bindings.data_1(data_1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      stores.page.set(page);
    }
    $$rendered = `  ${constructors[1] ? `${validate_component(constructors[0] || missing_component, "svelte:component").$$render(
      $$result,
      { data: data_0, this: components[0] },
      {
        this: ($$value) => {
          components[0] = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(constructors[1] || missing_component, "svelte:component").$$render(
            $$result,
            { data: data_1, form, this: components[1] },
            {
              this: ($$value) => {
                components[1] = $$value;
                $$settled = false;
              }
            },
            {}
          )}`;
        }
      }
    )}` : `${validate_component(constructors[0] || missing_component, "svelte:component").$$render(
      $$result,
      { data: data_0, form, this: components[0] },
      {
        this: ($$value) => {
          components[0] = $$value;
          $$settled = false;
        }
      },
      {}
    )}`} ${``}`;
  } while (!$$settled);
  return $$rendered;
});
const options = {
  app_template_contains_nonce: false,
  csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false }, "reportOnly": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
  csrf_check_origin: false,
  track_server_fetches: false,
  embedded: false,
  env_public_prefix: "PUBLIC_",
  env_private_prefix: "",
  hooks: null,
  // added lazily, via `get_hooks`
  preload_strategy: "modulepreload",
  root: Root,
  service_worker: false,
  templates: {
    app: ({ head, body, assets, nonce, env }) => `<!DOCTYPE html>\r
<html lang="en" class="h-full">\r
	<head>\r
		<meta charset="utf-8" />\r
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />\r
		<meta name="theme-color" content="rgb(249, 250, 251)" />\r
		<script>\r
			if (\r
				localStorage.theme === "dark" ||\r
				(!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)\r
			) {\r
				document.documentElement.classList.add("dark");\r
				document\r
					.querySelector('meta[name="theme-color"]')\r
					.setAttribute("content", "rgb(26, 36, 50)");\r
			}\r
\r
			// For some reason, Sveltekit doesn't let us load env variables from .env here, so we load it from hooks.server.ts\r
			window.gaId = "%gaId%";\r
		<\/script>\r
		` + head + '\r\n	</head>\r\n	<body data-sveltekit-preload-data="hover" class="h-full dark:bg-gray-900">\r\n		<div id="app" class="contents h-full">' + body + `</div>\r
\r
		<!-- Google Tag Manager -->\r
		<script>\r
			if (window.gaId) {\r
				const script = document.createElement("script");\r
				script.src = "https://www.googletagmanager.com/gtag/js?id=" + window.gaId;\r
				script.async = true;\r
				document.head.appendChild(script);\r
\r
				window.dataLayer = window.dataLayer || [];\r
				function gtag() {\r
					dataLayer.push(arguments);\r
				}\r
				gtag("js", new Date());\r
				/// ^ See https://developers.google.com/tag-platform/gtagjs/install\r
				gtag("config", window.gaId);\r
				gtag("consent", "default", { ad_storage: "denied", analytics_storage: "denied" });\r
				/// ^ See https://developers.google.com/tag-platform/gtagjs/reference#consent\r
				/// TODO: ask the user for their consent and update this with gtag('consent', 'update')\r
			}\r
		<\/script>\r
	</body>\r
</html>\r
`,
    error: ({ status, message }) => '<!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<title>' + message + `</title>

		<style>
			body {
				--bg: white;
				--fg: #222;
				--divider: #ccc;
				background: var(--bg);
				color: var(--fg);
				font-family:
					system-ui,
					-apple-system,
					BlinkMacSystemFont,
					'Segoe UI',
					Roboto,
					Oxygen,
					Ubuntu,
					Cantarell,
					'Open Sans',
					'Helvetica Neue',
					sans-serif;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100vh;
				margin: 0;
			}

			.error {
				display: flex;
				align-items: center;
				max-width: 32rem;
				margin: 0 1rem;
			}

			.status {
				font-weight: 200;
				font-size: 3rem;
				line-height: 1;
				position: relative;
				top: -0.05rem;
			}

			.message {
				border-left: 1px solid var(--divider);
				padding: 0 0 0 1rem;
				margin: 0 0 0 1rem;
				min-height: 2.5rem;
				display: flex;
				align-items: center;
			}

			.message h1 {
				font-weight: 400;
				font-size: 1em;
				margin: 0;
			}

			@media (prefers-color-scheme: dark) {
				body {
					--bg: #222;
					--fg: #ddd;
					--divider: #666;
				}
			}
		</style>
	</head>
	<body>
		<div class="error">
			<span class="status">` + status + '</span>\n			<div class="message">\n				<h1>' + message + "</h1>\n			</div>\n		</div>\n	</body>\n</html>\n"
  },
  version_hash: "hwfer6"
};
function get_hooks() {
  return import("./hooks.server.js");
}
export {
  set_public_env as a,
  set_building as b,
  get_hooks as g,
  options as o,
  public_env as p,
  set_private_env as s
};
