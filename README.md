# nodejs-tutorial

> Tutorial project demonstrating common NodeJS development libraries & tools.

## Contents of the tutorial

### Express

De-facto standard library for setting up backend services. In the tutorial used for a very simple REST API (currently only GET).

### Winston

Logging functionality using Winston.

### Mongoose and MongoDB

Creating a simple database model with Mongoose for storing data in MongoDB.

Also demonstrating the `ref` option and `populate` functionality of Mongoose. For more details on this refer to [the official docs for query population](https://mongoosejs.com/docs/populate.html). 

### Jest with supertest and mongodb-memory-server

Unit-testing the Express server backend utilizing an in-memory MongoDB server pre-loaded with test data.

Run `npm start test` to run the tests.

### Docker

Dockerizing the app and run it in a virtual container.

To create and run with Docker, execute the following lines in the tutorial's main directory.

```bash
# build the image
docker build -t tsmx/nodejs-tutorial .
# run the image, publish port 3000 and point 'mongoservice' to the Docker bridge IP to localhost
docker run -p 3000:3000 --add-host=mongoservice:172.17.0.1 tsmx/nodejs-tutorial
```

In order to let a Docker container communicate with local services like MongoDB you have to find out the Docker network bridge IP of your installation. In this tutorial the hostname alias `mongoservice` is used, read more about that [here](#mongodb-hostname-alias). By default `172.17.0.1` is used as Docker's bridge IP. Check out your actual bridge IP by executing `docker network inspect bridge | grep Gateway`. For more details refer to the [Docker documentation on networking of standalone containers](https://docs.docker.com/network/network-tutorial-standalone/).

### Docker-Compose

Docker-Compose the app together it with a MongoDB database to create fully self-contained containerized solution.

Includes showcase for the `wait-for-it.sh` script to ensure proper [order of starting up composed services](https://docs.docker.com/compose/startup-order/), e.g. DB before application.

## File and folder structure

A quick overview on the most important files & folders.

```
nodejstutorial
|
+-- controllers/        --> implementation of the logic for the REST API routes
|
+-- models/             --> Mongoose model definitions
|
+-- routes/             --> definition of the Express routes
|
+-- scripts/            --> additional needed scripts, e.g. wait-for-it.sh
|
+-- snippets/           --> usefuls code snippets that are not part of the project itself
|
+-- tests/              --> Jest unit test implementation
|
+-- utils/              --> helper modules for logging with Winston and connecting Mongoose to MongoDB
|
+-- app.js              --> main Express app implementation 
|
+-- jest.config.js      --> general Jest configuration settings
|
+-- start.js            --> startup wrapper for the app
```

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

- `controllers/masterDataController.js`
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

The script will create and populate a collection called `masterdata` with some documents representing contacts, bookings and booking positions. These documents are linked by reference to create the following logical structure:

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

*Note:* This model is not optimal and only used for demonstration purposes (e.g. to show how Mongoose's `populate` works in the route `/masterdata/:id/children`). In a real project, a structure based on nested MongoDB documents would be more senseful and optimal for the use-case of modelling a contract hierarchy like this.

You can validate that hierarchy after loading the test data by executing the provided script in `snippets/query-testdata.js` in your `nodejstest` database (e.g. by copy & pasting into a Robo 3T's shell window and pressing F5). It should print out exactly that hierarchy if everything was inserted successful.

## Hints and best-practices

Here are some hints and best-practices demonstrated that project which you may find useful when implementing your own NodeJS project.

### MongoDB hostname alias

To make a project work seamlessly in both - local environment (MongoDB on localhost) and within Docker/Docker-Compose scenario - you should use an alias for the MongoDB database host and not `localhost`. The advantage is, that the alias works in both environments without the need of changing any configuration. In the tutorial I use `mongoservice` as the alias in Docker-Compose. 

- To be able to run the project with your local MongoDB, simply add the following line to your `/etc/hosts` file:
  ```bash
  127.0.0.1   mongoservice
  ```
- For the Docker environment we use the `--add-host` option of the `docker run` command to let the alias point to your local machine by passing the Docker's bridge IP:
  ```bash
  ... --add-host=mongoservice:172.17.0.1 ...
  ```

Having this in place, the application always correctly connects to MongoDB by using the hostname alias `mongoservice`.

### MongoDB data directory for Docker-Compose

In the tutorial I mapped a local folder to `/data/db` in the MongoDB Docker-Compose container to have the data stored locally to persist it, e.g. when pruning all Docker data.

To adjust this configuration for your environment, change the follwing line in `docker-compose.yml` and put your path to the MongoDB data left to the colon:

```yml
mongoservice:
    ...
    volumes:
      - /YOUR/PATH/TO/LOCAL/MONGODATA:/data/db
```

### _id field in Mongoose schemas

In this tutorial a "speaking" and manually set string is used as the `_id` for every object for demonstration purposes. By default, Mongoose generates an `_id` field automatically in every schema and populates it with a unique value of type `ObjectId(...)`. 

In most cases, it is the best solution to let Mongoose handle the `_id` field and to not set it manually. For more details refer to the [Mongoose guide on id's](https://mongoosejs.com/docs/guide.html#_id).

### Implementing Express configuration and startup in separate files

You may have noticed that in this tutorial the traditional startup of the Express app by calling `app.listen(...)` is sourced-out to a separate small file called `start.js`. In `app.js` the Express app is configured entirely an then exported. Now, why that?

The rationale for that is: unit-testing. Libraries like `supertest` often need a reference to the fully configured Express app when it is not yet started and not yet bound to any concrete port. This can easily be achieved by splitting the Express app configuration and startup into two files like in this tutorial.

### Muting logging for unit-testing

Since test frameworks like Jest normally produce their own (quite verbose) output, it makes sense to mute your own loggers when running the tests. To achieve this without any extensive configuration etc., simply make use of the fact that in most testing frameworks the environment variable `NODE_ENV` is set to the value `test`.

Having that in mind, it is only two lines od code to achieve your logger being mute while running the tests:

```js
// see: utils/logging.js
...
var transporters = [new winston.transports.Console()];
if (process.env.NODE_ENV == 'test') {
    transporters[0].silent = true;
}
...
```

Note that it is very common and a good practice to have `NODE_ENV` set to `test` when running unit-tests and also having it set to `production` when you are in an production environment. Some managed environments like Google App Engine automatically set `NODE_ENV` to `production` when running you app there (for more details refer to [App Engine environment variables](https://cloud.google.com/appengine/docs/standard/nodejs/runtime?hl=de#environment_variables)). 