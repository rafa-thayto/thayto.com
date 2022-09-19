# Rebuild the source code only when needed
FROM node:16-alpine AS turbo_builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=@thayto/portfolio --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:16-alpine AS installer
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install the dependencies
COPY --from=turbo_builder /app/out/json/ .
COPY --from=turbo_builder /app/out/yarn.lock ./yarn.lock
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Build the project
COPY --from=turbo_builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=@thayto/portfolio

# # Install dependencies only when needed
# FROM node:16-alpine AS deps
# # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
# WORKDIR /app

# # Install dependencies based on the preferred package manager
# COPY package.json yarn.lock* ./
# RUN \
#   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#   else echo "Lockfile not found." && exit 1; \
#   fi


# Rebuild the source code only when needed
# FROM node:16-alpine AS project_builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# # Next.js collects completely anonymous telemetry data about general usage.
# # Learn more here: https://nextjs.org/telemetry
# # Uncomment the following line in case you want to disable telemetry during the build.
# # ENV NEXT_TELEMETRY_DISABLED 1

# RUN yarn build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=installer /app/apps/portfolio/public ./public
COPY --from=installer /app/apps/portfolio/next.config.js .
COPY --from=installer /app/apps/portfolio/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/portfolio/entrypoint.sh ./apps/portfolio/
COPY --from=installer --chown=nextjs:nodejs /app/apps/portfolio/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/portfolio/.next/static ./apps/portfolio/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENTRYPOINT ["sh", "apps/portfolio/entrypoint.sh"]
