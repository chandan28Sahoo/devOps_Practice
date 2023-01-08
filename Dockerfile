FROM node:14-alpine

# Create app directory
WORKDIR /app

COPY . .

RUN npm install

# Bundle app source
COPY . /app

EXPOSE 30022

CMD [ "npm", "run", "server" ]