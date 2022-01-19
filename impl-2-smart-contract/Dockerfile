FROM node:16-alpine

WORKDIR /app

RUN apk add git

RUN yarn add global truffle

COPY contract ./contract/
RUN cd ./contract/ && yarn install

COPY frontend ./client/
RUN cd ./client/ && yarn install

ENV PATH /app/node_modules/.bin:$PATH
