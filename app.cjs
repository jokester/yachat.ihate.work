const Fastify = require("fastify");
const FastifyStatic = require("@fastify/static");
const path = require("node:path");

const KEE = process.env.KEE;

const app = Fastify({
  logger: true,
});

app.register(require('@fastify/compress'))

app.register(require("@fastify/http-proxy"), {
  upstream: "https://api.openai.com",
  prefix: "/openai",
  /**
   * @param {import('fastify').FastifyRequest} request
   * @param reply
   * @param next
   */
  preHandler(request, reply, next) {
    request.headers["authorization"] = `Bearer ${KEE}`;
    request.headers["host"] = "api.openai.com";
    next();
  },
});

// app.register(require('@fastify/multipart'));

// app.register(require('@fastify/reply-from'), {
//   // http2: true,
//   rewriteRequestHeaders(request, headers) {
//     console.debug('rewriteRequestHeaders', request, headers);
//     if (1) return headers;
//     headers['Authorization'] = `Bearer ${process.env.OPENAI_API_KEY}`;
//     return headers;
//   },
// });
// app.post('/v1/audio/transcriptions', (request, reply) => {
//   // console.debug('requ', request.url);
//   reply.from(request.url);
// });

app.register(FastifyStatic, {
  root: path.join(__dirname, "public"),
  dotfiles: "deny",
  etag: true,
  cacheControl: false,
  /**
   *
   * @param res
   * @param {string} path
   * @param stat
   */
  setHeaders(res, path, stat) {
    res.setHeader("Cache-Control", "public, must-revalidate, max-age=30");
  },
});

// Run the server!
const port = Number(process.env.PORT ?? "5000");
const host = process.env.HOST ?? "localhost";
app.listen({ port, host }, (err, address) => {
  if (err) {
    throw err;
  }
  console.debug(`listening on ${address}`);
});
