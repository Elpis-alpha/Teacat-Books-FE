FROM node:20-buster AS base

FROM base AS deps
RUN apt-get update && apt-get install -y libc6 make python3 g++ \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS production

WORKDIR /usr/src/prod
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder /usr/src/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]

# Development image, copy all the files and run next
FROM base AS development

WORKDIR /usr/src/dev
ENV NODE_ENV development

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

CMD ["npm", "run", "dev"]