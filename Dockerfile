# BUILD
FROM node:14-alpine as builder

WORKDIR /usr/gist-monitor

COPY package*.json ./
COPY tsconfig*.json ./


RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD [ "node", "./build/app.js" ]

