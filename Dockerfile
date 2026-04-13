FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN pnpm install

FROM deps AS dev
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev", "--", "--host"]

FROM deps AS builder

ARG VITE_POCKETBASE_URL
ENV VITE_POCKETBASE_URL=$VITE_POCKETBASE_URL

COPY . .
RUN pnpm build

FROM nginx:alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf 
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
