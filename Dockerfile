FROM node:16-alpine
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node . .
USER node
ENV NODE_ENV="" DB_HOST="" PORT=""
RUN npm install && npm run build
EXPOSE 3000
CMD [ "node", "dist/index.js" ]
