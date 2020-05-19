FROM node:10

# # Install GCP CLI
# RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
# RUN sudo apt-get update && sudo apt-get install google-cloud-sdk

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

# WORKDIR /usr/src/app

# Log into CLI
# RUN gcloud auth activate-service-account breakglass@velvety-mason-277416.iam.gserviceaccount.com --key-file=key.json

CMD [ "node", "dist" ]