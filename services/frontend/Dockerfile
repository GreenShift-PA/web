FROM node:latest

WORKDIR /app

COPY package.json .

RUN npm i && npm install -g @angular/cli

COPY . ./

ENV PORT 4200

EXPOSE $PORT

CMD ["ng", "serve", "--host", "0.0.0.0"]