FROM  node:15.0.1-alpine3.10
WORKDIR /chitchat
ADD package*.json /chitchat/
ADD client/package*.json /chitchat/client/
RUN npm install
RUN cd client && npm install
CMD cd ..
ADD . .
RUN node index.js
CMD cd /client/
RUN npm start

EXPOSE 3000
