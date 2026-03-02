FROM node:20-alpine

# Run as non-root user
RUN addgroup -S slcapi && adduser -S slcapi -G slcapi

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy source code
COPY server.js ./

# #12: Create uploads dir with proper ownership before switching user
RUN mkdir -p /app/uploads && chown -R slcapi:slcapi /app
USER slcapi

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
