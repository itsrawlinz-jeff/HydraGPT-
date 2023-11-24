import "../../../../chunks/database.js";
import { e as error } from "../../../../chunks/index.js";
import "node:url";
import "node:fs/promises";
import "@huggingface/hub";
import "parquetjs";
async function POST({ request }) {
  {
    throw error(500, "Parquet export is not configured.");
  }
}
export {
  POST
};
