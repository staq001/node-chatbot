#syntax=docker/dockerfile:1.5

FROM node:24.5-bullseye as build

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci --only=production

USER node

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]