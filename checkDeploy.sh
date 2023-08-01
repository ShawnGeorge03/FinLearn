#!/bin/bash

REGION=$1
SERVICE=$2

counter=60
while [ $counter -gt 0 ]; do
  if gcloud run services describe $SERVICE --region=$REGION | grep ✔; then
    exit 0
  fi

  echo "$SERVICE is still deploying, waiting for $(($counter))s"
  ((counter--))
  sleep 1
done

echo "$SERVICE failed to deploy within timeout"
exit 1