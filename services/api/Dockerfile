FROM node:10-alpine

WORKDIR /app

COPY package.json .

RUN npm i 

COPY . ./

ENV POST 3000

EXPOSE $PORT

CMD ["npm", "run", "dev-nodemon"]