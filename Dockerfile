# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files for production dependencies
COPY package*.json ./

# Install only production dependencies and peer dependencies
RUN npm ci --omit=dev && npm install livekit-client && npm cache clean --force

# Copy pre-built application
COPY dist ./dist
COPY test-sdk.js ./

# Expose port (if needed for example apps)
EXPOSE 3000

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Default command - can be overridden
CMD ["node", "test-sdk.js"]