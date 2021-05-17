FROM node:12

WORKDIR /usr/app

COPY package*.json ./

RUN npm install -g
COPY . ./

EXPOSE 3000
CMD [ "node", "app.js"]
