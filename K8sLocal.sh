minikube start
eval $(minikube docker-env)
yarn docker
kubectl run bg --image=jstillerman/breakglass:v1 --port=8080 --image-pull-policy=Never
kubectl expose deployment bg --name=bg-service --type=NodePort
minikube service bg-service