FROM node:current-alpine

# Set the application directory
WORKDIR /usr/src/sweatybot
# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle the source code
COPY . .

ENTRYPOINT [ "node", "index.js" ]
