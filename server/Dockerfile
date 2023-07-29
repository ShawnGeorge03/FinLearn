FROM node:18-alpine AS base

FROM base as builder

WORKDIR /src
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build


FROM base as main

COPY package.json ./
COPY --from=builder /src/build ./
RUN npm install --omit=dev
EXPOSE 4000
CMD [ "node", "./server.js" ]