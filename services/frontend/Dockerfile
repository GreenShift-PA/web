FROM node:latest as build

WORKDIR /app

COPY package.json .

RUN npm i 

COPY . ./

ENV POST 4200

EXPOSE $PORT

CMD ["npm", "start"]