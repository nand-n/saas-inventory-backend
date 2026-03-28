# Development stage
FROM node:20 AS development

WORKDIR /app

COPY package*.json yarn.lock ./

RUN npm i --f && npm install -g @nestjs/cli

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start:dev"]

# Build stage
FROM node:20 AS build

WORKDIR /app

COPY package*.json yarn.lock ./

RUN npm i --f

COPY . .

# build NestJS into dist/
RUN yarn build

# Production stage
FROM node:20 AS production

WORKDIR /app

COPY package*.json yarn.lock ./

RUN npm i --f

# Copy only dist from build stage
COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["npm", "run", "start:prod"]
