# Dockerfile
# FROM node:14.17.5-bullseye AS builder
FROM node:14.18.2-bullseye-slim AS builder
# ARG MAX_OLD_SPACE_SIZE=8192
# ENV NODE_OPTIONS=--max-old-space-size=${MAX_OLD_SPACE_SIZE}

WORKDIR /app


COPY package.json .
# RUN npm cache clean --force
RUN npm install
# RUN npm install --legacy-peer-deps

COPY . . 
EXPOSE 9000
RUN ["npm", "run", "build"]

CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--port", "9000"]
# CMD ["npm", "start"]


# STAGE 2 nginx
# FROM nginx:alpine

# WORKDIR /usr/share/nginx/html

# RUN rm -rf ./*

# COPY --from=builder /app/public .

# ENTRYPOINT ["nginx", "-g", "daemon off;"]