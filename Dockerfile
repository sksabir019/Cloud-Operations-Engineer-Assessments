# Use a Node.js base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the application code
COPY . .

# Expose the port the application listens on
EXPOSE 3000

# Set the command to run the application
CMD [ "node", "index.js" ]
