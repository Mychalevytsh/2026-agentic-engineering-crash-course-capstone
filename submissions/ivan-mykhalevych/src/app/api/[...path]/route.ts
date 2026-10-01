import { handleApi } from "../../../server/api";
import { getDatabase } from "../../../server/db";

async function respond(request: Request): Promise<Response> {
  const result = handleApi(
    getDatabase(),
    {
      method: request.method,
      path: new URL(request.url).pathname,
      origin: request.headers.get("origin"),
      host: request.headers.get("host"),
      contentType: request.headers.get("content-type"),
      cookie: request.headers.get("cookie"),
      body: request.method === "GET" ? "" : await request.text(),
    },
    Date.now(),
    process.env.NODE_ENV === "production",
  );
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (result.setCookie !== undefined) headers.set("Set-Cookie", result.setCookie);
  return Response.json(result.body, { status: result.status, headers });
}

export { respond as GET, respond as POST, respond as PATCH, respond as DELETE };
