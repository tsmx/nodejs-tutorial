# nodejs-tutorial

> Tutorial project demonstrating common NodeJS development libraries & tools.

## Contents

### Express

De-facto standard library for setting up backend services. In the tutorial used for a very simple REST API (currently only GET).

### Winston

Logging functionality using Winston.

### Mongoose and MongoDB

Creating a simple database model with Mongoose for storing data in MongoDB.

### Docker

Dockerizing the app and run it in a virtual container.

To create and run with Docker, execute the following lines in the tutorial's main directory.

```bash
# build the image
docker build -t tsmx/nodejs-tutorial .
# run the image, publish port 3000 and point 'mongoservice' to the Docker bridge IP to localhost
docker run -p 3000:3000 --add-host=mongoservice:172.17.0.1 tsmx/nodejs-tutorial
```

In order to let a Docker container communicate with local services like MongoDB you have to find out the Docker network bridge IP of your installation. In this tutorial the hostname alias `mongoservice` is used, read more about that [here](#mongodb-hostname-alias). By default `172.17.0.1` is used. Check out your bridge IP by executing `docker network inspect bridge | grep Gateway`. For more details refer to the [Docker documentation on networking of standalone containers](https://docs.docker.com/network/network-tutorial-standalone/).

### Docker-Compose

Docker-Compose the app together it with a MongoDB database to create fully self-contained containerized solution. Includes showcase for the `wait-for-it.sh` script to ensure proper [order of starting up composed services](https://docs.docker.com/compose/startup-order/), e.g. DB before application.

## Routes

The backend service in this tutorial will set up the following routes after starting-up.

```
http://localhost:3000
|
+-- /masterdata              --> return all objects from MongoDB
|
+-- /masterdata/:id          --> return object with given :id from MongoDB
|
+-- /masterdata/:id/children --> return array of direct children of object :id from MongoDB 
|
+-- /test                    --> test echo
|
+-- /test/:id                --> test echo
|
+-- /test/:id/children       --> test echo
```

The logic for the routes is implemented in the following controllers:

- `controllers/masterDataContronller.js`
- `controllers/testDataController.js`

## MongoDB scenario used in the tutorial

### Authorization

For the sake of simplicity MongoDB's authorization is supposed to be disbaled for this tutorial. So please make sure that the following lines are commented out in your `mongod.conf`.

```bash
#security:
#  authorization: enabled
```

### DB name and loading of test data

The databse name used in this tutorial is `nodejstest`. To prepare the the tutorial simply create a database with this name and load the intial test data by executing the contents of `snippets/insert-testdata.js` in this DB. You can simply do this e.g. by copying it to a Robo-3T shell window and press F5.

The script will create and populate a collection called `masterdata` with some objects of type contact, booking and booking position. These objects are linked by reference to create the following logical structure:

```bash
Contract 1
|
+-- Booking 1-1
|   |
|   +-- Booking-Position 1-1-1
|   |
|   +-- Booking-Position 1-1-2
|
+-- Booking 1-2

Contract 2
|
+-- Booking 2-1
    |
    +-- Booking-Position 2-1-1
```

*Note:* This structure is not optimal and only used for demonstration purposes (e.g. to show how Mongoose's `populate` works in the route `/masterdata/:id/children`). In a real project, a structure based on nested documents would be more senseful for the use-case of modelling a contract hierarchy like this.

You can validate that hierarchy after loading the test data by executing the provided script in `snippets/mongo-queries.js` in your `nodejstest` database. It should print out exactly that hierarchy if everything was inserted successful.

## Hints

### MongoDB hostname alias

To make a project work seamlessly in both - local environment (MongoDB on localhost) and within Docker/Docker-Compose scenario - you should use an alias for the MongoDB database host and not `localhost`. The advantage is, that the alias works in both environments without the need of changing any configuration.

In the tutorial I use `mongoservice` as the alias in Docker-Compose. To be able to run the project with your local MongoDB, simply add the following line to your `/etc/hosts` file:

```bash
127.0.0.1   mongoservice
```

Having this in place, the application can always connect to the MongoDB by using the hostname alias `mongoservice`.

### MongoDB data directory for Docker-Compose

In the tutorial I mapped a local folder to `/data/db` in the MongoDB Docker-Compose container to have the data stored locally to persist it, e.g. when pruning all Docker data.

To adjust this configuration for your environment, change the follwing line in `docker-compose.yml` and put your path to the MongoDB data left to the colon:

```yml
mongoservice:
    ...
    volumes:
      - /YOUR/PATH/TO/LOCAL/MONGODATA:/data/db
```

