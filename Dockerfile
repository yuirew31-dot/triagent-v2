FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY server/ ./server/
COPY client/ ./client/

# Build
RUN npm run server:build && npm run client:build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "run", "server:start"]
