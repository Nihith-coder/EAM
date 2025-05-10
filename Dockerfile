# Use Node.js official image as base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Build the app (compiles TypeScript)
RUN npm run build

# Expose port 3000 (adjust if necessary)
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start:prod"]
