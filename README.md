# nodejs-tutorial

> Tutorial project demonstrating common NodeJS development libraries & tools.

Also intended to be a good starting point for your own projects.

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

### CI/CD with GitHub Actions

Automatically build and test your NodeJS project with GitHub Actions.

To learn more about this, how to migrate from Travis-CI or how to integrate with [Coveralls](https://coveralls.io/) also check out [this article](https://tsmx.net/ci-cd-with-github-actions-for-nodejs/) on that.

### Docker

Dockerizing the app and run it in a virtual container.

To create and run with Docker, execute the following lines in the tutorial's main directory.

```bash
# build the image
docker build -t tsmx/nodejs-tutorial .
# run the image, publish port 3000 and point 'mongoservice' to the Docker bridge IP to localhost
docker run -p 3000:3000 --add-host=mongoservice:172.17.0.1 tsmx/nodejs-tutorial
```

In order to let a Docker container communicate with local services like MongoDB you have to find out the Docker network bridge IP of your installation and pass it to the `--add-host` option of `docker run`. In this tutorial the hostname alias `mongoservice` is used, read more about that [here](#mongodb-hostname-alias). By default `172.17.0.1` is used as Docker's bridge IP. Check out your actual bridge IP by executing `docker network inspect bridge | grep Gateway`. For more details refer to the [Docker documentation on networking of standalone containers](https://docs.docker.com/network/network-tutorial-standalone/).

### Docker-Compose

Docker-Compose the app together it with a MongoDB database to create fully self-contained containerized solution. MongoDB's data is assumed to be external in a local folder and not part of the Docker-Compose as this is not a best-practice.

To run the example simply run the following command in the main folder:

```bash
docker-compose up
```

The prerequisities for this are:
- You have a local MongoDB data directory. This will be mounted into Docker-Compose. Assumed local directory is `/var/db/mongo/data`. See also [here for the directory location](#mongodb-data-directory-for-docker-compose) and [here for loading the sample data](#db-name-and-loading-of-test-data).
- The local UID:GID (user ID + group ID) that is allowed to access the local MongoDB data directory is `1001:1001`. To adapt to your needs, change the `user` entry in `docker-compose.yml` accordingly.

This Docker-Composethe is also a good example of services depending on each other: the example app needs the MongoDB database running properly before itself can start serving requests. To achieve this, Docker-Compose has features for controlling the [order of starting up composed services](https://docs.docker.com/compose/startup-order/). In this example the `depends_on` option is used together with an `condition: service_started` condition.

Please note that the use of the built-in order control features should be preferred over the commonly used `wait-for-it.sh` which was very popular in the past. This script is a non-Docker dependency and also introduces the need of a `bash` in the used Docker images which is not present in many modern images.

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

The databse name used in this tutorial is `nodejstest`. To prepare the the tutorial, simply create a database with this name and load the intial test data by executing the contents of `snippets/insert-testdata.js` in this DB. You can simply do this e.g. by copying it to a Robo-3T shell window and pressing F5.

The script will create and populate a collection called `masterdata` with some documents representing contracts, bookings and booking positions. These documents are linked by reference to create the following logical structure:

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

*Note:* This data model is not optimal and only used for demonstration purposes (e.g. to show how Mongoose's `populate` works in the route `/masterdata/:id/children`). In a real project, a structure based on nested MongoDB documents would be more senseful and optimal for the use-case of modelling a contract hierarchy like this.

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

In the tutorial a local folder is mapped to `/data/db` in the MongoDB Docker-Compose container to have the data stored locally to persist it, e.g. when pruning all Docker data.

To adjust this configuration for your environment, change the following line in `docker-compose.yml` and put your local path to the MongoDB data left to the colon:

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

### Muting loggers for testing

Since test frameworks like Jest normally produce their own (quite verbose) output, it makes sense to mute your own loggers when running the tests. To achieve this without any extensive configuration etc., simply make use of the fact that in most testing frameworks the environment variable `NODE_ENV` is set to the value `test`.

Having that in mind, it is only two lines of code to achieve your logger being mute while running the tests:

```js
// see: utils/logging.js
...
var transporters = [new winston.transports.Console()];
if (process.env.NODE_ENV == 'test') {
    transporters[0].silent = true;
}
...
```

Note that it is very common and a good practice to have `NODE_ENV` set to `test` when running unit-tests and also having it set to `production` when you are in an production environment. Some managed environments like Google App Engine automatically set `NODE_ENV` to `production` when running your app there. 

For more details about App Enginge environment variables refer to [the offical docs](https://cloud.google.com/appengine/docs/standard/nodejs/runtime?hl=de#environment_variables). 

### Handling the port to be used

To make an Express app finally run, you call `app.listen()` with the number of the port to use and a callback. Now instead of putting a hardcoded number there - which may be perfectly fine for your local development - it is quite common to set the port like this:

```js
const httpPort = process.env.PORT || 3000;
```

With that you would always run on port `3000` unless an environment variable with name `PORT` is set to something different.

One reason why this is a best practice is that with this you are prepared for running your app in managed cloud services like Google App Engine or AWS Elastic Beanstalk. There, the port to be used is determined by the service platform and injected by setting the environment variable `PORT`. For more details have look here for [App Engine](https://cloud.google.com/appengine/docs/standard/nodejs/runtime?hl=de#environment_variables) or here for [AWS Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/nodejs-platform-proxy.html).

A second argument for doing so it that it gives you the control over the port number without any need of code changes if you need to deviate from the standard port for any reason. You can simply set `PORT` to any number e.g. in a startup-script. 

## Legal notice

This tutorial is provided under the permissive MIT license. So feel free to use it as a starting point for your own projects of any favour (commercial, non-commercial, whatever...). 

Many 3rd party libraries and tools are demonstrated and used here. It is your responsibility to check the licensing of any used 3rd party library and tool in this tutorial and decide on your own if it fits to your special use-case.