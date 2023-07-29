FROM node:18-alpine AS base

FROM base as builder
ARG SEVER_URL
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /client
COPY ./package.json ./replaceURL.sh ./
COPY . .
RUN chmod +rwx ./replaceURL.sh
RUN ./replaceURL.sh $SEVER_URL
RUN npm install
RUN npm run build

FROM base as main
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /client
COPY package.json ./
COPY --from=builder /client/public ./public
COPY --from=builder /client/.next/standalone ./
COPY --from=builder /client/.next/static ./.next/static
RUN npm install --omit=dev
EXPOSE 3000
CMD [ "npm", "start" ]
