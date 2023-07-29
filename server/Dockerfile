FROM node:18-alpine AS base

FROM base as builder

WORKDIR /server
COPY --link package.json ./
RUN npm install
COPY --link . .
RUN npm run build


FROM base as main

COPY package.json ./
COPY --from=builder --link /server/build ./
RUN npm install --omit=dev
EXPOSE 4000
CMD [ "node", "./server.js" ]