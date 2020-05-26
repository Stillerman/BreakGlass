FROM node:10

# Downloading gcloud package
RUN curl https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.tar.gz > /tmp/google-cloud-sdk.tar.gz

# Installing the package
RUN mkdir -p /usr/local/gcloud \
    && tar -C /usr/local/gcloud -xvf /tmp/google-cloud-sdk.tar.gz \
    && /usr/local/gcloud/google-cloud-sdk/install.sh

# Adding the package path to local
ENV PATH $PATH:/usr/local/gcloud/google-cloud-sdk/bin
# Create app directory
WORKDIR /usr/src/app

COPY . .

# Build UI
WORKDIR /usr/src/app/modules/breakglass-ui


RUN npm install
RUN npm run build

WORKDIR /usr/src/app

WORKDIR /usr/src/app/modules/breakglass-api

RUN npm install
RUN npm run build

EXPOSE 8080

CMD [ "node", "dist" ]