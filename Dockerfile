FROM node:18-slim

COPY . /srv/app

WORKDIR /srv/app

RUN yarn && yarn build && yarn install --production
