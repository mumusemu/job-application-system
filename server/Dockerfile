# Use Node.js as the base image
FROM node:16-alpine

# Set the working directory for the server
WORKDIR /app

# Copy server package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the server code
COPY . .

# Expose the application port
EXPOSE 5000

# Start the server application
CMD ["npm", "start"]
