FROM node:22-alpine

# =============BACK-END=============

WORKDIR /home/node/app/back-end

COPY ./back-end .

RUN npm install esbuild@0.21.5

RUN npm install --omit=dev

RUN npm install -g prisma

RUN npx prisma generate

RUN npm run build

# =============FRONT-END=============

WORKDIR /home/node/app/front-end

COPY ./front-end .

RUN npm install -g pnpm

RUN pnpm install --ignore-scripts

RUN pnpm build

# =============CHECKOUT TO BACK-END AND EXECUTE APP=============
WORKDIR /home/node/app/back-end

EXPOSE 3000

USER node

CMD ["npm", "run", "start:prod"]
