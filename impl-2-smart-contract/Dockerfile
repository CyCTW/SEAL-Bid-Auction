FROM node:16-alpine

WORKDIR /app

RUN apk add git

RUN yarn add global truffle

RUN mkdir contract
COPY contract/package.json ./contract/package.json
COPY contract/package-lock.json ./contract/package-lock.json
RUN cd contract & yarn install

RUN mkdir client
COPY frontend/package.json ./client/package.json
COPY frontend/package-lock.json ./client/package-lock.json
RUN cd client & yarn install

ENV PATH /app/node_modules/.bin:$PATH

VOLUME ["/app/contract", "/app/client"]
