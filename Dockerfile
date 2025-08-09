
# Development stage
FROM node:20 AS development

WORKDIR /app

COPY package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 5000

CMD ["yarn", "start:dev"]

# Production stage
FROM node:20 AS production

WORKDIR /app

COPY package*.json ./

# Install all dependencies including dev (needed for build)
RUN yarn install --frozen-lockfile

COPY . .

# Build the app using Nest CLI (now available because devDeps installed)
RUN yarn build

# Remove dev dependencies to slim down final image
RUN yarn install --frozen-lockfile

EXPOSE 5000

CMD ["yarn", "start:prod"]
