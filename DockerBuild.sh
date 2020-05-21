source .secrets
echo $OAuthClientId
docker build --build-arg KeyFile=$KeyFile --build-arg OAuthClientId=$OAuthClientId --build-arg ServiceAccount=$ServiceAccount . -t jstillerman/breakglass:v1