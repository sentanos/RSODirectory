# Create network for our containers to communicate with each other
docker network create mongonet
# Run mongo on our network while exposing the mongodb port. Name is important for mongo-seed to find
# the database
docker run -d --network mongonet --name mongo -p 127.0.0.1:27017:27017 mongo
# Load data into the database
docker run --network mongonet mongo-seed