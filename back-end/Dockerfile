FROM node:20.10.0

WORKDIR /home/node/app

COPY . .

RUN npm install --production

RUN npm install -g prisma

RUN npm run build

EXPOSE 3000

USER node

CMD ["npm", "run", "start:prod"]
