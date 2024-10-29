FROM node:20.18.0 AS migrate

LABEL stage=migrate

ENV NODE_ENV=development

ARG PORT=3000

EXPOSE ${PORT}

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn prisma generate

ENTRYPOINT [ "yarn", "prisma", "migrate", "deploy" ]


FROM node:20.18.0 AS development

LABEL stage=development

ENV NODE_ENV=development

ARG PORT=3000

EXPOSE ${PORT}

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn prisma generate

ENTRYPOINT [ "yarn", "dev" ]
