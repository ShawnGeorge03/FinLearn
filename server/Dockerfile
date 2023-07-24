FROM node:18 as build

WORKDIR /src
COPY package.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:18-alpine as main

COPY --from=build /src /
ENV PORT 4000
EXPOSE ${PORT}
CMD [ "node", "./build/server.js" ]