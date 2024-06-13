#!/bin/bash

NAMESPACE="ns-gsd-spar-qa01"
# Apply configmaps manifest
kubectl apply -f pmxresp-configmap.yaml -n $NAMESPACE

# Apply secrets manifest
kubectl apply -f pmxresp-secret.yaml -n $NAMESPACE

# Apply service manifests
kubectl apply -f pmxresp-frontend-service.yaml -n $NAMESPACE
kubectl apply -f pmxresp-backend-service.yaml -n $NAMESPACE
kubectl apply -f pmxresp-notifications-service.yaml -n $NAMESPACE
kubectl apply -f pmxresp-scheduler-service.yaml -n $NAMESPACE

# Apply and wait for backend deployment
kubectl apply -f pmxresp-backend-deployment.yaml -n $NAMESPACE
kubectl wait --for=condition=available deployment/pmxresp-backend-deployment -n $NAMESPACE

# Apply and wait for notifications deployment
kubectl apply -f pmxresp-notifications-deployment.yaml -n $NAMESPACE
kubectl wait --for=condition=available deployment/pmxresp-notifications-deployment -n $NAMESPACE

# Apply and wait for scheduler deployment
kubectl apply -f pmxresp-scheduler-deployment.yaml -n $NAMESPACE
kubectl wait --for=condition=available deployment/pmxresp-scheduler-deployment -n $NAMESPACE

# Apply and wait for frontend deployment
kubectl apply -f pmxresp-frontend-deployment.yaml -n $NAMESPACE
kubectl wait --for=condition=available deployment/pmxresp-frontend-deployment -n $NAMESPACE

echo "All deployments are ready. You can access the application at:"

# Display information about deployed services
kubectl get services -n $NAMESPACE

