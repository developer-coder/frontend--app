# Base image for all React apps
FROM node:20-alpine as builder

# Create root app directory
WORKDIR /app

# Copy and build each app separately
COPY shop-app ./shop-app
RUN cd shop-app && npm install && npm run build

COPY product-app ./product-app
RUN cd product-app && npm install && npm run build

COPY admin-app ./admin-app
RUN cd admin-app && npm install && npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy each app's build to a subdirectory
COPY --from=builder /app/shop-app/build /usr/share/nginx/html/shop
COPY --from=builder /app/product-app/build /usr/share/nginx/html/product
COPY --from=builder /app/admin-app/build /usr/share/nginx/html/admin

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
