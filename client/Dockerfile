FROM node:18-alpine AS base

FROM base as builder
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM base as main
ENV PORT 3000
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app
COPY package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN npm install --omit=dev
EXPOSE ${PORT}
CMD [ "npm", "start" ]
