import { r as redirect } from "../../../../chunks/index.js";
const load = async ({ params }) => {
  throw redirect(302, "../conversation/" + params.id);
};
export {
  load
};
