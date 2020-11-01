FROM  node:15.0.1-alpine3.10
WORKDIR /chitchat
ADD package*.json /chitchat/
ADD client/package*.json /chitchat/client/
RUN npm install
CMD cd client
RUN npm install
CMD cd ..
ADD . .
CMD cd /client/
CMD [ "node" , "build" ]
RUN npm install

