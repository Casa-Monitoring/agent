# Agent

## Build image
```
docker build -t casamonitoring/agent .
```


## Run container from image
```
docker run \
    --detach \
    --name casa-monitoring-agent \
    --restart "always" \
    --hostname "..." \
    --env MONITORING_STORAGE_NAME="..." \
    --env MONITORING_STORAGE_KEY="..." \
    casamonitoring/agent
```


## Stop container
```
docker stop casa-monitoring-agent
```