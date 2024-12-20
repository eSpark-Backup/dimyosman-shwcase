FROM node:18.17.1
WORKDIR /
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "tsconfig.json", "./"]
RUN npm install --production=false --silent && mv node_modules ../
COPY . .

RUN npm run migration:generate
RUN npm run migration:run

RUN npm run build

CMD ["npm", "run", "start"]