FROM node:10-stretch

WORKDIR /app

COPY package.json package.json
RUN yarn

COPY tsconfig.json tsconfig.json
COPY shared/ shared/
COPY src/ src/

CMD ["yarn", "start"]
