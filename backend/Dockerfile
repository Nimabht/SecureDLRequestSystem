FROM node:20.2.0-alpine

WORKDIR /opt/secure-dlr-request-system

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
