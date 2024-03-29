# yachat

A OpenAI chat bot. Running in Cloudflare Worker with [hono](https://hono.dev/getting-started/cloudflare-workers)

## Run in local

Set `vars.KEE` in `wrangler.toml` and run:

```
yarn
yarn dev
```

## Preview before deploying to CF Worker

```
yarn wrangler publish --env=prod --dry-run --outdir=./worker-preview --minify=true
```

## Run in Cloudflare Worker

Set `env.prod.route` in `wrangler.toml` and run:

```
yarn build
yarn wrangler secret put --env=prod KEE
yarn wrangler publish --env=prod --minify=true
```
