FROM nginx:1.23-alpine

RUN mkdir -p /app/static

COPY frontend /app/static

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
