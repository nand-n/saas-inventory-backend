# ---------- Build Stage ----------
FROM node:20 AS build

WORKDIR /app

# Copy package.json + yarn.lock first (better caching)
COPY package*.json yarn.lock ./

# Install all dependencies (including devDeps for build)
RUN yarn install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the NestJS project
RUN yarn build

# ---------- Production Stage ----------
FROM node:20 AS production

WORKDIR /app

# Copy package.json + yarn.lock to install only prod dependencies
COPY package*.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Copy only the compiled dist + other needed files
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

EXPOSE 5000

CMD ["yarn", "start:prod"]
