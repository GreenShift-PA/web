FROM node:latest

WORKDIR /app

COPY package.json .

RUN npm i && npm install -g @angular/cli

COPY . ./

ENV POST 4200

EXPOSE $PORT

CMD ["ng", "serve"]