# Dockerfile for client
FROM node:18-alpine

WORKDIR /app

# copy package.json ve package-lock.json files
COPY package*.json ./

# install dependencies
RUN npm install

# copy application code
COPY . ./

# build
RUN npm run build

# start
CMD ["npm", "run", "preview"]
