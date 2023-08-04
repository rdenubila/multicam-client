
# Docker

## Build image

```
docker build -t multicam --platform linux/arm64 .     
```

## Tag image version

```
docker tag multicam rdenubila/multicam-recorder:latest
```
```
docker tag multicam rdenubila/multicam-recorder:<version>
```

## Push to Docker Hub
```
docker push rdenubila/multicam-recorder:<version>
```