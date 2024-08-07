#!/bin/bash

helm upgrade --install syself-backend ./syself-backend \
  --namespace syself-backend \ 
  --create-namespace