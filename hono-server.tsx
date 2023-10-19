import { Hono } from "hono";
import { logger } from "hono/logger";
import { Bindings } from "./bindings";
import { serveStatic } from "hono/cloudflare-workers";
import { IndexPage } from "./pages";

const app = new Hono<{ Bindings: Bindings }>({});
app.use("*", logger());

app.get(
  "/*",
  serveStatic({ root: /* relative to bucket in wrangler.toml */ "." })
);

app.use("/openai/*", async (c) => {
  const incomingHeaders = new Headers(c.req.raw.headers);

  const forwardUrl = new URL(c.req.raw.url);
  forwardUrl.host = "api.openai.com";
  forwardUrl.protocol = "https";
  forwardUrl.port = "";
  forwardUrl.pathname = forwardUrl.pathname.replace("/openai", "");

  const forwardHeaders: Record<string, string> = {
    host: "api.openai.com",
  };
  [
    "accept-encoding",
    "accept",
    "accept-language",
    "content-type",
    "content-length",
  ].forEach((h) => {
    if (incomingHeaders.has(h)) {
      forwardHeaders[h] = incomingHeaders.get(h)!;
    }
  });

  //   console.debug("req body", forwardHeaders);

  return await fetch(forwardUrl.toString(), {
    method: c.req.raw.method,
    headers: {
      ...forwardHeaders,
      authorization: `Bearer ${c.env.KEE}`,
    },
    body: c.req.raw.body,
  });
  // return new Response(response.body, response)
});

app.get("/", (c) => c.html(<IndexPage />));

export default app;
