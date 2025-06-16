# Stage 1: Build React apps
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .

RUN cd shop-app && npm install && npx cross-env CI=false npm run build && \
    cd ../react-keycloak-app && npm install && npx cross-env CI=false npm run build && \
    cd ../product-app && npm install && npx cross-env CI=false npm run build && \
    cd ../my-login-app && npm install && npx cross-env CI=false npm run build && \
    cd ../admin-app && npm install && npx cross-env CI=false npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine
COPY --from=builder /app/shop-app/build /usr/share/nginx/html/shop
COPY --from=builder /app/react-keycloak-app/build /usr/share/nginx/html/keycloak
COPY --from=builder /app/product-app/build /usr/share/nginx/html/product
COPY --from=builder /app/my-login-app/build /usr/share/nginx/html/login
COPY --from=builder /app/admin-app/build /usr/share/nginx/html/admin
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
