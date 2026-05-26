FROM node:20-alpine

WORKDIR /app

# install deps
COPY package.json package-lock.json* ./
RUN npm ci --silent

# copy sources
COPY . .

EXPOSE 5173

# vite dev with host 0.0.0.0 so it's reachable from host
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
