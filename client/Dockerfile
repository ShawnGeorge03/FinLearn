FROM node:18 as build

WORKDIR /app
COPY package.json ./
RUN npm install
RUN npm install sharp --save-dev
COPY . .
RUN npm run build


FROM node:18-alpine as main

COPY --from=build /app /
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
EXPOSE ${PORT}
CMD [ "npm", "start" ]
