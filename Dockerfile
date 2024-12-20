FROM node:18.17.1
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production=false --silent && mv node_modules ../
COPY . .
RUN npm run migration:generate
RUN npm run migration:run
RUN npm run build
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "run", "start"]