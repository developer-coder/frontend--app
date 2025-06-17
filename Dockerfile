# Use official Nginx image
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx content
RUN rm -rf ./*

# Copy built React apps into subdirectories
COPY admin-app/build ./admin
COPY shop-app/build ./shop
COPY product-app/build ./product
COPY my-login-app/build ./login
COPY react-keycloak-app/build ./keycloak

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
