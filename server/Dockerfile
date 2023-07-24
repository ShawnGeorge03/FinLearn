FROM node:18-alpine AS base

FROM base as builder

WORKDIR /src
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build


FROM base as main
ENV PORT 4000

COPY package.json ./
COPY --from=builder /src/build ./
COPY --from=builder /src/.env ./.env
RUN npm install --omit=dev
EXPOSE ${PORT}
CMD [ "node", "./server.js" ]