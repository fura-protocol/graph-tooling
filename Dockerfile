FROM node:19-alpine
RUN apk --no-cache add git curl

WORKDIR /app
COPY ./packages/cli /app

RUN npm i --verbose
RUN npm run-script build
