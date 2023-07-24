FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

ENV NEXT_TELEMETRY_DISABLED 1

ENV PORT 3000

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]