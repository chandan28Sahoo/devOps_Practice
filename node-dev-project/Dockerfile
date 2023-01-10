FROM node:14-alpine
# Create app directory
WORKDIR /app
COPY . .
RUN npm cache clean --f
RUN npm install
# Bundle app source
COPY . /app
EXPOSE 3000
CMD [ "npm", "run", "dev" ]