# thayto.com

My personal website and blog

## Books library database (Drizzle + libSQL)

The `/books` page reads from a SQLite database via Drizzle ORM and
`@libsql/client`.

### Local development

```sh
bun run db:migrate   # apply migrations to file:./local.db
bun run db:seed      # load src/data/books.json into the database
bun run db:studio    # optional: browse the data
```

`DATABASE_URL` defaults to `file:./local.db` (gitignored), so no env setup is
needed locally.

### Production

The local file database is ephemeral on serverless hosts (Vercel), so
production must point at a remote Turso database via env vars (see
`.env.example`):

```sh
DATABASE_URL=libsql://<your-db>.turso.io
DATABASE_AUTH_TOKEN=<token>
```

### Automatic seeding (Vercel deploys)

`vercel.json` sets the build command to
`bun run db:migrate && bun run db:seed && bun run build`, so every Vercel
deploy migrates and re-seeds the Turso database **before** `next build`
prerenders the `/books` pages. Since `src/data/books.json` is the source of
truth and lives in the repo, updating the library is just: edit the JSON,
push to `main`, and the deploy ships fresh data and fresh static pages
together. No separate seeding step is needed.

`DATABASE_URL` and `DATABASE_AUTH_TOKEN` must be set in the Vercel project's
environment variables (Production scope).

GitHub Actions CI seeds the gitignored `file:./local.db` the same way before
its build step (see `.github/workflows/ci.yml`).

## Leaving the images in tiny size (with ffmpeg)

```sh
ffmpeg -i <FILENAME>.<EXTENSION> -vf scale=20:-1 <FILENAME>-small.<EXTENSION>
```
