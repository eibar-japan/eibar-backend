# Eibar backend

## What is Eibar and what is the role of this repo?

Eibar is the "Uber" for freelance, in-person language tutors. It allows teachers and students to sign up as users of the Eibar app and find each other for in-person language lessons.

This repo is the heart of the Eibar system, as it is the API backend that holds (will hold?) all user, lesson, and payment data and serve that data to the various other Eibar consumers of that data: web application, iOS, and Android apps.

## Getting started

The Eibar development environment, while possible to recreate installing different

### Prerequisites

- Node v14.18.0 (LTS as of Sept 2021) --> See Note in the Notes section.
- Docker Desktop (with Docker Compose)

### Environment install (docker)

Once prerequisites are installed, the developer setup can be started with one command/

```
> npm run init-eibar
```

This will install dependencies and build the following Docker containers using docker-compose:

- App container (Node)
- Database container (Postgres)

Note: the final step of this script is to run the database migrations for both databases. If this unexpectedly fails, simply rerun using:

```
> npm run mig -- development,test latest
```

## Database

Postgresql database is being utilized, with knex as the query builder.

### Development environment

The following databases are created in the Postgres docker container.

- `eibar`: development database
- `eibar_test`: independent testing database

### Migrations

Knex.js is being used for Database connections, and knex migrations can be created/run from the following commands (per knex documentation).

```
# creation
> knex migrate:make NAME --knexfile ./external/db/knexfile.js

# execution
> knex migrate:latest --knexfile ./external/db/knexfile.js --env development
> knex migrate:down --knexfile ./external/db/knexfile.js --env development
```

An NPM script is also available for use for up/down/latest/rollback migration actions to one or more environments with the following syntax

```
> npm run mig -- ENVIRONMENT up/down/latest/rollback
> npm run mig -- ENVIRONMENT1,ENVIRONMENT2 up/down/latest/rollback
```

### Connecting to the Docker Postgres instance

Due to port binding issues with the Docker Postgres instance, simply `psql DB_NAME` will not connect you to the instance. For easy access, use the following to connect to the development database. (Check knexfile.js for dev environment DB pw.)

```
> npm run psql
```

Otherwise, the following can be used as a template.

```
> psql -h localhost -p 5432 -U eibaradmin -d eibar
```

## Testing

Tests can be run by using the `npm test` script command from the root folder. Targeted testing of a specific test or group of tests should be done by adding a ".only" to the testing file and running `npm test`, per Mocha documentation.

Testing setup consists of:

- Framework: mocha
- Assertion library + extensions: chai, chai-http

## Notes

- Regarding Node installation: The suggested running environment for the Node application is in a Docker container and the locally installed Node is not responsible for running the app. However, Node is required to populate node_modules and providing the user with the ability to use the "npm run xxx" commands that are used in setup, testing, etc. Of course, a locally installed Node instance can also be used to run the app, just like the Postgres database can also be run locally (with appropriate changes to settings files).
- The app's port is changed to 3001 for testing, so as to not conflict with port 3000 being used in the Docker container.
