# Use alpine-node
FROM mhart/alpine-node
ENV LAST_UPDATED 20180428

# Copy source code
COPY . /app

# Change working directory
WORKDIR /app

# Install dependencies
RUN npm install --production --registry=https://registry.npm.taobao.org

# Expose API port to the outside
EXPOSE 8006

# Launch application
CMD ["npm", "run", "dockerStart"]