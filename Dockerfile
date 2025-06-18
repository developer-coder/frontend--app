# Stage 1: Build all React apps
FROM node:18-alpine as builder

WORKDIR /app

COPY . .

# Build each app
RUN cd admin-app && npm install && npm run build && cd ..
RUN cd shop-app && npm install && npm run build && cd ..
RUN cd product-app && npm install && npm run build && cd ..
RUN cd my-login-app && npm install && npm run build && cd ..
RUN cd react-keycloak-app && npm install && npm run build && cd ..

# Stage 2: Nginx for serving apps
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build outputs to different subfolders
COPY --from=builder /app/admin-app/build /usr/share/nginx/html/admin
COPY --from=builder /app/shop-app/build /usr/share/nginx/html/shop
COPY --from=builder /app/product-app/build /usr/share/nginx/html/product
COPY --from=builder /app/my-login-app/build /usr/share/nginx/html/login
COPY --from=builder /app/react-keycloak-app/build /usr/share/nginx/html/keycloak
