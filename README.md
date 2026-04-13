# poll-anon

Anonymous polling app. Create a poll, share the ID, let anyone submit options and vote — no account required.

## Stack

- **Frontend** — React 19, TypeScript, Vite
- **UI** — Chakra UI v3
- **Backend** — PocketBase (self-hosted)

## Getting started

**1. Start PocketBase**

Download PocketBase and run it:

```sh
./pocketbase serve
```

Import the collection schema:

```sh
./pocketbase import pb_collections.json
```

**3. Configure rate limits (recommended)**

Open the PocketBase admin UI at <http://localhost:8090/_/> and go to **Settings → Rate limits**. Add a rule to limit abuse:

- Label: any (e.g. `default`)
- Duration: `1s`
- Max requests: `10`
- Audience: leave blank to apply to all routes

This caps each IP to 10 requests per second across all API endpoints.

A stricter daily cap is also enforced server-side via `pb_hooks/rate_limit.pb.js`: each IP is limited to **5 poll creations per day**. Adjust `MAX_POLLS_PER_DAY` in that file to change the limit.

**4. Start the frontend**

```sh
pnpm install
pnpm dev
```

Open <http://localhost:5173>.

## How it works

Each user gets a random ID stored in `localStorage` — no sign-up needed. Polls move through three phases automatically based on deadlines:

- **Submission** — anyone can submit options
- **Voting** — options are locked; anyone can cast one vote
- **Closed** — results are visible, no further interaction

Share a poll by copying the poll ID from the detail page.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Type-check and build |
| `pnpm preview` | Preview production build |
| `pnpm format` | Format source files with Prettier |
| `pnpm lint` | Lint with ESLint |
