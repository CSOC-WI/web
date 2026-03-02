FROM nginx:alpine

# Copy only the necessary static site files (whitelist approach)
COPY index.html           /usr/share/nginx/html/
COPY admin.html           /usr/share/nginx/html/
COPY login.html           /usr/share/nginx/html/
COPY news.html            /usr/share/nginx/html/
COPY service-detail.html  /usr/share/nginx/html/
COPY 404.html             /usr/share/nginx/html/
COPY 50x.html             /usr/share/nginx/html/
COPY css/                 /usr/share/nginx/html/css/
COPY js/                  /usr/share/nginx/html/js/
COPY images/              /usr/share/nginx/html/images/

# Custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
