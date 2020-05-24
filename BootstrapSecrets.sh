source .secrets
echo "{ \"clientId\": \"$OAuthClientId\"}" > modules/breakglass-ui/src/secrets.json
cp conf.yaml modules/breakglass-ui/src/conf.yaml
cp conf.yaml modules/breakglass-api/conf.yaml
echo Done