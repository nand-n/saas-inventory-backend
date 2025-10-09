# # Development stage
# FROM node:20 AS development

# WORKDIR /app

# COPY package*.json ./

# RUN npm i --force
 
# COPY . .

# EXPOSE 5000

# CMD ["npm", "run", "start:dev"]


# # Production stage
# FROM node:20 AS production

# WORKDIR /app

# COPY package*.json ./

# # Install all dependencies including dev for build
# RUN npm i --force

# COPY . .

# # Build the app
# RUN npm run build

# EXPOSE 5000

# CMD ["npm" , "start:prod"]

# Development stage
FROM node:20 AS development

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 5000

CMD ["yarn", "start:dev"]

# Build stage
FROM node:20 AS build

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# build NestJS into dist/
RUN yarn build

# Production stage
FROM node:20 AS production

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

# Copy only dist from build stage
COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["yarn", "start:prod"]
