# Stage 1: Build all React apps
FROM node:18 as builder

WORKDIR /app
COPY . .

# Build admin-app
WORKDIR /app/admin-app
RUN npm install && npm run build

# Build shop-app
WORKDIR /app/shop-app
RUN npm install && npm run build

# Build other apps as needed...

# Stage 2: Serve with nginx
FROM nginx:alpine

# Clean default nginx html directory
RUN rm -rf /usr/share/nginx/html/*

# Copy admin-app to /usr/share/nginx/html/admin
COPY --from=builder /app/admin-app/build /usr/share/nginx/html/admin

# Copy shop-app to /usr/share/nginx/html/shop
COPY --from=builder /app/shop-app/build /usr/share/nginx/html/shop

# Copy shop-app to /usr/share/nginx/html/shop
COPY --from=builder /app/shop-app/build /usr/share/nginx/html/product

# Copy shop-app to /usr/share/nginx/html/shop
COPY --from=builder /app/shop-app/build /usr/share/nginx/html/login


# Copy your custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
