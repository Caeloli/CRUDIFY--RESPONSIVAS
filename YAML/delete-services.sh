#!/bin/bash

kubectl delete service pmxresp-scheduler-service -n ns-gsd-spar-qa01
kubectl delete deployment pmxresp-scheduler-deployment -n ns-gsd-spar-qa01

kubectl delete service pmxresp-notifications-service -n ns-gsd-spar-qa01
kubectl delete deployment pmxresp-notifications-deployment -n ns-gsd-spar-qa01

kubectl delete service pmxresp-frontend-service -n ns-gsd-spar-qa01
kubectl delete deployment pmxresp-frontend-deployment -n ns-gsd-spar-qa01

kubectl delete service pmxresp-backend-service -n ns-gsd-spar-qa01
kubectl delete deployment pmxresp-backend-deployment -n ns-gsd-spar-qa01

kubectl delete configmap pmxresp-backend-config -n ns-gsd-spar-qa01
kubectl delete secret pmxresp-backend-secret -n ns-gsd-spar-qa01
