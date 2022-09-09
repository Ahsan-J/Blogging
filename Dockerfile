FROM node:14.18.3-slim

WORKDIR /app

COPY . /app

ENV NODE_ENV = production

RUN npm install

RUN npm run build

CMD ["node", "dist/main.js"]
