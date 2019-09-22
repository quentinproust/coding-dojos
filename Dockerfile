FROM openjdk:8

RUN groupadd -g 999 dojos && useradd -r -u 999 -g dojos dojos

RUN mkdir -p /usr/app/dojos

WORKDIR /usr/app/dojos

# copy gradle
COPY ./gradle                       /usr/app/dojos/gradle
COPY ./gradlew                      /usr/app/dojos/gradlew

# run gradle to download and cache wrapper binaries
RUN ./gradlew; exit 0

# copy sources
COPY ./client/src                   /usr/app/dojos/client/src
COPY ./client/build.gradle.kts      /usr/app/dojos/client/build.gradle.kts
COPY ./client/gradle.properties     /usr/app/dojos/client/gradle.properties
COPY ./client/package.json          /usr/app/dojos/client/package.json
COPY ./client/package-lock.json     /usr/app/dojos/client/package-lock.json
COPY ./src                          /usr/app/dojos/src
COPY ./build.gradle.kts             /usr/app/dojos/build.gradle.kts
COPY ./gradle.properties            /usr/app/dojos/gradle.properties
COPY ./package.json                 /usr/app/dojos/package.json
COPY ./package-lock.json            /usr/app/dojos/package-lock.json
COPY ./settings.gradle.kts          /usr/app/dojos/settings.gradle.kts

# build project
RUN ./gradlew build --info --parallel

# copy final jar
RUN cp /usr/app/dojos/build/libs/com.serli.codingdojos.jar /usr/app/com.serli.codingdojos.jar

WORKDIR /usr/app

# remove sources
RUN rm -rf ./dojos

RUN chown -R dojos:dojos /usr/app/com.serli.codingdojos.jar

USER dojos

# run application with this command line
ENTRYPOINT ["./com.serli.codingdojos.jar"]
CMD [""]
#CMD ["/bin/ping", "localhost"]
