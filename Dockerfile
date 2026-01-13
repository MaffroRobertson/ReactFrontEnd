# Multi-stage Dockerfile for Vite + React
# Build the app with Node, then serve with nginx

FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies first (uses package.json / package-lock.json if present)
COPY package*.json ./
RUN npm ci --silent

# Copy app sources
COPY . .

# Allow build-time injection of the API base URL (Vite reads VITE_* env at build time)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the production bundle
RUN npm run build

# --------------------------------------------------
# Production image: nginx serving the built files
# --------------------------------------------------
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
