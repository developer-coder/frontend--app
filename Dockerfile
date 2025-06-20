# Stage 1: Build all React apps
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

# Build each app separately (better for debugging)
WORKDIR /app/admin-app
RUN npm install keycloak-js && npm install && npm run build

WORKDIR /app/shop-app
RUN npm install && npm run build

WORKDIR /app/product-app
RUN npm install && npm run build

WORKDIR /app/my-login-app
RUN npm install && npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/admin-app/build /usr/share/nginx/html/admin
COPY --from=builder /app/shop-app/build /usr/share/nginx/html/shop
COPY --from=builder /app/product-app/build /usr/share/nginx/html/product
COPY --from=builder /app/my-login-app/build /usr/share/nginx/html/login
