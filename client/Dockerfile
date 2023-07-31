# Base Image
FROM node:18-alpine AS base

# Build Stage
FROM base as builder
ARG SEVER_URL
# Disables Next.js Telemetry
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /client

# Copies all the relevant files to build the site
COPY --link package.json replaceURL.sh package-lock.json* ./
COPY --link . .

# Gives Read & Write permission to script and runs it
RUN chmod +rwx ./replaceURL.sh
RUN ./replaceURL.sh $SEVER_URL

# Installs all dependencies using either `npm ci` or `npm install`
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else npm install; \
  fi
RUN npm run build

# Package Stage
FROM base as main

# Disables Next.js Telemetry
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /client

# Copies all the relevant files to start the site
COPY --link package.json package-lock.json* ./
COPY --from=builder --link /client/public ./public
COPY --from=builder --link /client/.next/standalone ./
COPY --from=builder --link /client/.next/static ./.next/static

# Installs all dependencies using either `npm ci` or `npm install`
RUN \
  if [ -f package-lock.json ]; then npm ci --omit=dev; \
  else npm install --omit=dev; \
  fi

# Listens on Port 3000
EXPOSE 3000

# Start the Container
CMD [ "npm", "start" ]
