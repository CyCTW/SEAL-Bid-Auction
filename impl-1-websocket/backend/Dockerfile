FROM node:16-alpine

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package*.json ./ 
RUN npm install -g express 
RUN npm install  

COPY . ./ 
EXPOSE 3002

CMD ["node", "server.js"]