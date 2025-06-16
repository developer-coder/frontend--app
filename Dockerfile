# Stage 1: Build all apps
FROM node:20-alpine as build
WORKDIR /app

COPY . . 

# Build each app
RUN 
	cd shop-app && npm install && npx cross-env CI=false npm run build && \
    cd ../react-keycloak-app && npm install && npx cross-env CI=false npm run build && \
    cd ../product-app && npm install && npx cross-env CI=false npm run build && \
    cd ../my-login-app && npm install && npx cross-env CI=false npm run build && \
    cd ../admin-app && npm install && npx cross-env CI=false npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy all build outputs to different sub-paths
COPY --from=build /app/shop-app/build /usr/share/nginx/html/shop/
COPY --from=build /app/react-keycloak-app/build /usr/share/nginx/html/keycloak/
COPY --from=build /app/product-app/build /usr/share/nginx/html/product/
COPY --from=build /app/my-login-app/build /usr/share/nginx/html/login/
COPY --from=build /app/admin-app/build /usr/share/nginx/html/admin/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
