# Build Image
FROM node:lts-alpine AS build
ARG ENV
WORKDIR /app
COPY . /app/
RUN chmod u+x build.sh && ./build.sh
 
# Production Image
FROM node:lts-alpine
RUN apk add dumb-init
ENV NODE_ENV production
ENV PORT 8080
EXPOSE 8080/tcp
WORKDIR /app
RUN mkdir db
RUN chown node:node /app/*
USER node
COPY --chown=node:node --from=build /app/node_modules /app/node_modules
COPY --chown=node:node --from=build /app/dist /app/dist
CMD ["dumb-init", "node", "dist/index.js"]