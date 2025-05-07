FROM node:20.10.0


# =============BACK-END=============

WORKDIR /home/node/app/back-end

COPY ./back-end .

RUN npm install esbuild@0.21.5

RUN npm install --omit=dev

RUN npm install -g prisma

RUN npm run build

# =============FRONT-END=============

WORKDIR /home/node/app/front-end

COPY ./front-end .

RUN npm install

RUN npm run build

# =============CHECKOUT TO BACK-END AND EXECUTE APP=============
WORKDIR /home/node/app/back-end

EXPOSE 3000

USER node

CMD ["npm", "run", "start:prod"]
