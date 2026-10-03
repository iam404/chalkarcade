FROM nginx:alpine@sha256:db35bfc6b2951e7f8a72db5db120288c127ffaeeb4a6d4b95a26fead017d5913

LABEL org.opencontainers.image.title="Chalk Arcade public website" \
      org.opencontainers.image.description="Static legal, support, deletion and app-store landing pages"

ENV PORT=8080

COPY nginx.conf.template /etc/nginx/templates/default.conf.template

COPY index.html 404.html robots.txt sitemap.xml /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY privacy/ /usr/share/nginx/html/privacy/
COPY support/ /usr/share/nginx/html/support/
COPY terms/ /usr/share/nginx/html/terms/
COPY delete-account/ /usr/share/nginx/html/delete-account/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/healthz" || exit 1

CMD ["nginx", "-g", "daemon off;"]
