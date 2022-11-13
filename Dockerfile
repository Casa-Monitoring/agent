FROM node:19.0.1-alpine3.16

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY index.js .

CMD ["npm", "start"]