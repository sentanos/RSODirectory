# This exists as a seeder for a linked mongo database
FROM golang:1.8 AS build
COPY . /app
WORKDIR /app
RUN go get go.mongodb.org/mongo-driver/mongo
RUN go build -o /bin/project

FROM mongo
COPY --from=build /bin/project /bin/project
COPY . /app
WORKDIR /app
CMD /bin/project /app/rso-data.csv "mongodb://mongo:27017" \
    && mongo rsodirectory --host mongo --eval 'db.rsos.createIndex({name:"text", description:"text"})' \
    && mongo rsodirectory --host mongo --eval 'db.rsos.createIndex({name:1})'
