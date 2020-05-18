FROM node:10

# Create app directory
WORKDIR /usr/src/app

COPY . .

# Build UI
WORKDIR modules/breakglass-ui

RUN npm install
RUN npm run build


WORKDIR /usr/src/app
WORKDIR modules/breakglass-api

RUN npm install
RUN npm run build

EXPOSE 8080
CMD [ "node", "dist" ]