# How to contribute

## Package the application

Build the project :

```sh
./gradlew build
```

The binaries will be present in ./build/libs

## Docker

Both a Dockerfile and docker-compose.yml are present as examples.

The following command will : 

- build the application and start a docker container with it
- start a mongo docker container

```sh
docker-compose up
```  

## Require mongo

The simplest way to have a running mongo : 

```sh
docker-compose up mongo-db
```

## Run for development

If you want to develop both the server and the client :

Start the client :

```sh
./gradlew client:run
```

Start the server :

```sh
FROM_PARCEL=true ./gradlew bootRun
```

If you only want to work on the server, you can build the client first and then start the server :

Build client and copy it in resources :

```sh
./gradlew copyClientBuild
```

Start the server :

```sh
./gradlew bootRun
```
