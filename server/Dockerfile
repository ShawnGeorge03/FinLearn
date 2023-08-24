# Base Image
FROM node:18-alpine AS base

# Build Stage
FROM base as builder

WORKDIR /server
# Installs all dependencies using either `npm ci` or `npm install`
COPY --link package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else npm install; \
  fi
COPY --link . .
RUN npm run build

# Package Stage
FROM base as main

# Installs all dependencies using either `npm ci` or `npm install`
COPY package.json package-lock.json* ./
COPY --from=builder --link /server/build ./
RUN \
  if [ -f package-lock.json ]; then npm ci --omit=dev; \
  else npm install --omit=dev; \
  fi

# Listens on Port 4000
EXPOSE 4000

# Start the Container
CMD [ "node", "./server.js" ]