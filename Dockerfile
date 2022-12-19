FROM nginx:latest AS solar-system
COPY ./src/build /src/build
COPY ./nginx.conf \
    /etc/nginx/conf.d/default.conf