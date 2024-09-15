FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm run clean && npm run init; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

COPY . .
COPY ./example.appconfig.json ./appconfig.json

RUN \
  if [ -f package-lock.json ]; then npm run migrate && npm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM node:22-alpine AS publish
WORKDIR /app
ENV NODE_ENV=production

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build /app/dist ./

EXPOSE 3000 
ENV PORT=3000

# Start the Next.js app
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]

