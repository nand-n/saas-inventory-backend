# Development stage
FROM node:20 AS development

WORKDIR /app

COPY package*.json ./

RUN npm i --force
 
COPY . .

EXPOSE 5000

CMD ["npm", "run", "start:dev"]


# Production stage
FROM node:20 AS production

WORKDIR /app

COPY package*.json ./

# Install all dependencies including dev for build
RUN npm i --force

COPY . .

# Build the app
RUN npm run build

# Remove dev dependencies to slim down image
RUN npm prune --production

EXPOSE 5000

CMD ["npm", "run", "start:prod"]
