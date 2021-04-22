FROM node:12

WORKDIR C:\Users\vixx1\OneDrive\문서\캡스톤서버\backend

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 3000
CMD [ "node", "app.js"]
