# SvelteKit + Cloudflare Workers (custom Worker entry)

This template bootstraps a SvelteKit app on Cloudflare Workers using a custom Worker entry (`src/worker.ts`) that wraps SvelteKit’s generated Cloudflare worker. It also includes a Durable Object skeleton, optional D1 database binding, and a scheduled job example.

## Quick start

1) Clone

```bash
git clone https://github.com/metasanjaya/svelte-cloudflare.git <folder>
cd <folder>
```

2) Install deps (pnpm recommended)

```bash
pnpm i
# or
npm i
```

3) Local Svelte dev (no Cloudflare runtime)

```bash
pnpm dev
```
This runs the Vite/Svelte dev server only (good for UI work). Cloudflare bindings (D1, Durable Objects, scheduled events) are not available in this mode.

4) Cloudflare Worker dev (Wrangler)

The custom worker imports `./.svelte-kit/cloudflare/_worker.js`, which exists only after a SvelteKit build. For live reloading:

- Terminal A: continuously build SvelteKit to regenerate `_worker.js`
```bash
pnpm build -- --watch
```
- Terminal B: run the Worker in Miniflare via Wrangler
```bash
npx wrangler dev src/worker.ts
```

One-off dev session (no watch):
```bash
pnpm build && npx wrangler dev src/worker.ts
```

5) Deploy

```bash
pnpm build
npx wrangler deploy src/worker.ts
```

## Expected environment and bindings

`src/worker.ts` expects the following on `env`:
- `MY_DURABLE_OBJECT` (Durable Object binding for `MyDurableObject`)
- `DB` (D1 database binding)
- `ASSETS` (Fetcher; optional — only if you wire a static asset service)

### D1 setup (optional)
```bash
npx wrangler d1 create svelte_cloudflare_db
# note the returned database_id and add it to wrangler.toml

# run migrations (example)
npx wrangler d1 execute svelte_cloudflare_db --file ./migrations/001_init.sql --local
```

### Durable Object
- Binding is defined in `[durable_objects]` above.
- Add a migration the first time you introduce a class (see `[[migrations]]`).
- Instantiate in code using `env.MY_DURABLE_OBJECT.idFromName(name)`.

### Scheduled Cron
The example scheduled handler runs every 5 minutes. Adjust `crons` in `wrangler.toml` to your needs.

## Scripts
- `pnpm dev` — Svelte dev server (no Cloudflare runtime)
- `pnpm build` — Build SvelteKit and generate `./.svelte-kit/cloudflare/_worker.js`
- `pnpm preview` — Preview the built client/server locally
- `pnpm check` — Type and Svelte diagnostics

Tip: for CF dev with auto-rebuild, keep two terminals open as shown above.

## Project layout (key files)
- `src/routes` — your Svelte pages/components
- `src/worker.ts` — custom Cloudflare worker entry that delegates to SvelteKit’s generated worker and adds your own logic (Durable Object, cron, APIs)
- `svelte.config.js`, `vite.config.ts`, `tsconfig.json` — tooling config

## Troubleshooting
- Error: "Cannot find module '../.svelte-kit/cloudflare/_worker.js'" → run `pnpm build` (or `pnpm build -- --watch` during dev).
- Cloudflare type errors → ensure `@cloudflare/workers-types` is installed and `tsconfig.json` includes `"types": ["@cloudflare/workers-types"]`.
- Wrangler login/auth issues → run `npx wrangler login` and ensure `account_id` is set if required for deploy.
