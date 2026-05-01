FROM nginx:1.25.2-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
