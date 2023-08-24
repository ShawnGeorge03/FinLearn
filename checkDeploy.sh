#!/bin/bash

# Set the region and service name variables from command line arguments
REGION=$1
SERVICE=$2

# Wait Time of 60 seconds
counter=60

while [ $counter -gt 0 ]; do

  # Checks if the service is deployed and ready at a specific region
  if gcloud run services describe $SERVICE --region=$REGION | grep ✔; then
    exit 0
  fi

  # Remaining Time 
  echo "$SERVICE is still deploying, waiting for $(($counter))s"
  ((counter--))

  # Waits 1 second before sending another request
  sleep 1
done

# If service failed to deploy, exits with code 1 will halt the job
echo "$SERVICE failed to deploy within timeout"
exit 1