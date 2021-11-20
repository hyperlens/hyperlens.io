FROM node:10-alpine AS build
ARG NODE_AUTH_TOKEN

RUN npm i -g npm@7

WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm ci
COPY . .
RUN npm run build


FROM nginx:1.21.1-alpine
WORKDIR /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build ./
