#!/bin/bash

source .env


helm upgrade --install syself-backend ./syself-backend \
  --set deploy.env.TEST_MONGODB_URI="$TEST_MONGODB_URI" \
  --set deploy.env.MONGODB_URI="$MONGODB_URI" \
  --set deploy.env.SECRET="$SECRET" \
  --namespace syself-backend --create-namespace
  